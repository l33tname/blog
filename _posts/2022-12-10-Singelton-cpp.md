---
published: true
description: Singelton template cpp
categories: [blog]
tags: [Singelton, cpp, template]
layout: post
---

When you build software at some point you might need a singleton.
Singletons are often a sign of bad software design, but that is not the focus of this blog post.

> In software engineering, the singleton pattern is a software design pattern that restricts the instantiation of a class to a singular instance.

(Source: [Wikipeda: Singleton pattern](https://en.wikipedia.org/wiki/Singleton_pattern))

And good software is using obviously a bunch of singletons.
To ensure that they are all the same we make use of a template.

```
template <class T> class Singleton
{
  using unique_ptr = std::unique_ptr<T>;

public:
  using element_type = T;
  using deleter_type = typename unique_ptr::deleter_type;

  /// Returns a reference to the single instance, the instance is created if none exists
  static element_type &GetInstance()
  {
    if (not _instance)
    {
      _instance.reset(new element_type{});
    }
    return *_instance;
  }

  /// Releases the single instance and frees its memory
  static void Release() { _instance.reset(); }

protected:
  Singleton() = default;
  virtual ~Singleton() = default;
  Singleton(const Singleton &) = delete;
  Singleton &operator=(const Singleton &) = delete;
  Singleton(const Singleton &&) = delete;
  Singleton &operator=(Singleton &&) = delete;

private:
  static unique_ptr _instance;
};
template <class T> typename Singleton<T>::unique_ptr Singleton<T>::_instance;
```

This implementation favors simplicity over thread-safety.
If you need a thread-safe implementation don't use this one.

With that template in place it is now super easy to create a new singleton like this:

```
class ConcreteSingleton : public Singleton<ConcreteSingleton>
{
  // need to be friend to access private constructor/destructor
  friend Singleton<ConcreteSingleton>;
  friend Singleton<ConcreteSingleton>::deleter_type;

public:
  void SomeGreatFunction() const;
  ...

// unless you have a great reason to have a
// public constructor and destructor it should be private
private:
  ConcreteSingleton() { ... some stuff ... }
  ~ConcreteSingleton() = default;
};
```

If you use that for all singletons in your code they all look uniform.
