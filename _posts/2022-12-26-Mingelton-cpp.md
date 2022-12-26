---
published: true
description: Singelton template cpp
categories: [blog]
tags: [Singelton, cpp, template]
layout: post
---


Wouldn't it be fun if your singleton exist multiple times?
The answer is yes! (Unless you need to debug it or when it actually needs to work)

Lets take a closer look at the situation:
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                            Application                                  │
│                                                                         │
│                             ┌───────────────────────────────────────┐   │
│                             │                                       │   │
│                             │ dynamic loaded library                │   │
│                             │ (Plugin)                              │   │
│                             │                                       │   │
│                             │                                       │   │
│                             │                                       │   │
│  ┌──────────────────────┐   │              ┌─────────────────────┐  │   │
│  │ shared library A     │   │              │ shared library A    │  │   │
│  │                      │   │              │                     │  │   │
│  │ [Singleton]          │   │              │ [Singleton]         │  │   │
│  │                      │   │              │                     │  │   │
│  └──────────────────────┘   │              └─────────────────────┘  │   │
│                             │                                       │   │
│                             └───────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

The application loads dynamically a library (basically a plugin) which was built using the shared library.
The shared library is where the singleton exists.
The same shared library is used directly in the app.

### Meyer's singleton

Lets take a [simple Meyer's singleton][2] implementation.

```
#pragma once
#include <string>

struct Simpleton {
    static Simpleton& GetInstance();
    std::string value{"simple"};

    Simpleton() = delete;
    Simpleton &operator=(Simpleton&&) = delete;
};
```

If we create a small test inside our main app where we access the singleton inside the app and
inside the dynamic loaded library.

```
{
    cout << "Simpleton:\n";

    auto* simple_instance = reinterpret_cast<void const*(*)()>(dlsym(plugin_handle, "simple_instance"));
    auto* simple_get = reinterpret_cast<std::string(*)()>(dlsym(plugin_handle, "simple_get"));
    auto* simple_set = reinterpret_cast<void(*)(std::string)>(dlsym(plugin_handle, "simple_set"));

    cout << " app=" << &Simpleton::GetInstance() << " plugin=" << simple_instance() << '\n';
    cout << " value=" << Simpleton::GetInstance().value << " get=" << simple_get() << '\n';
    simple_set("updated simple value");
    cout << " value=" << Simpleton::GetInstance().value << " get=" << simple_get() << '\n';
}
```

We expect that the address of `&Simpleton::GetInstance()` and `simple_instance()` is the same.
And after setting the singleton via the plugin we expect the value readout in the app to reflect the changed value.
Otherwise it is not really a singleton.
If we check the output that is what happens.

```
Simpleton:
 app=0x7fa0bf373160 plugin=0x7fa0bf373160
 value=simple get=simple
 value=updated simple value get=updated simple value
```

### Singleton Template

Check out the last [blog post][1] about the singleton pattern as a base for this singleton.
There is a small issue with this approach.
The template works great in almost all situations,
except when you need access to the singleton inside a library.

What happens when we use our fun singleton implementation.

```
{
    cout << "ConcreteSingleton:\n";

    auto* instance = reinterpret_cast<void const*(*)()>(dlsym(plugin_handle, "instance"));
    auto* get = reinterpret_cast<std::string(*)()>(dlsym(plugin_handle, "get"));
    auto* set = reinterpret_cast<void(*)(std::string)>(dlsym(plugin_handle, "set"));

    cout << " app=" << &ConcreteSingleton::GetInstance() << " plugin=" << instance() << '\n';
    cout << " value=" << ConcreteSingleton::GetInstance().value << " get=" << get() << '\n';
    set("updated value");
    cout << " value=" << ConcreteSingleton::GetInstance().value << " get=" << get() << '\n';
}
```

We would expect the same behavior as for our Meyer's singleton.

```
ConcreteSingleton:
 app=0x1ccf350 plugin=0x1ccf380
 value=default get=default
 value=default get=updated value
```

Ups. Seems like the plugin and our app are using different singletons.

If you use google to figure out what is happening here lets turn to google.
There is this very unhelpful comment from code review.

> When working with static and shared libraries,
> one must be careful that you don't have several implementations of the instance() function.
> That would lead to hard to debug errors where there actually would exist more than one instance.
> To avoid this use an instance function inside a compilation unit (.cpp) and not in a template from a header file.

source: <https://codereview.stackexchange.com/a/222755>

Otherwise I drew blank in searching for the issue.
Which was the main motivation to create this blog post with actual demo code.


### A solution

It seems like the issue is that `_instance` is defined inside the header.

```
template <class T> typename Singleton<T>::unique_ptr Singleton<T>::instance_;
```

Somehow this means we have a `_instance` in our application and
a different `_instance` inside our dynamic loaded library.

If we look at the unhelpful comment again we should move it to our cpp.
This is possible with a macro. something along the lines of this.

```
#define DEFINE_SINGLETON_INSTANCE(x) \
    template <> Singleton<x>::unique_ptr Singleton<x>::instance_{}
```

And each concrete singleton needs to implement this macro in the cpp file.

```
DEFINE_SINGLETON_INSTANCE(ConcreteSingleton);
```

Voilà it works as expected.

```
ConcreteSingleton:
 app=0x123c350 plugin=0x123c350
 value=default get=default
 value=updated value get=updated value
```

### What now?

If anyone can explain the behavior better or why this is the way it is let me know.
A example of the code can be found in this git repository: [l33tname/mingelton][3].
It contains a full CMake setup to reproduce the issue.
The first commit is a working state (with macro) and
the newest commit contains the diff where it fails.
Instructions to build and run can be found inside the `README.md`.

[1]: /blog/2022/12/10/Singelton-cpp/
[2]: https://laristra.github.io/flecsi/src/developer-guide/patterns/meyers_singleton.html
[3]: https://github.com/l33tname/mingelton
