---
published: true
description: Setup Elixir and Phoneix on Fedora
categories: [blog]
tags: [Fedora, Fedora 22, Elixir, Phoneix, psql, postgres, erlang]
layout: post
---

I heard all the cool kids program with this thing called elixir and phoenix. 
And as we all know I'm trying hard to be a cool kid (not really successful). But this is a
topic for an other blog post. So here is a small guide how you get started with phoenix on Fedora.  

##Install packages

The first step is installing elixir and postgresql which is the default 
database back end for phoenix. And then there are other packages needed 
like npm to use all these weird js front end tool which are to some extend 
integrate in phoenix.  

```
sudo dnf install erlang elixir postgresql-server npm inotify-tools
```

##Prepare psql and enable it

Now we can setup our postgresql server.

```
sudo postgresql-setup initdb
```

After the basic setup, we need to edit the `pg_hba.conf` file 
which you should find now in `/var/lib/pgsql/data/`. 


So we need to change ident to md5 on the line where the ADDRESS is 127.0.0.1/32 in `/var/lib/pgsql/data/pg_hba.conf`.

```
# TYPE    DATABASE        USER            ADDRESS                 METHOD
  host    all             all             127.0.0.1/32            md5
```

After we change the config file we can enable the service at start up and start it.

```
sudo systemctl enable postgresql
sudo service postgresql start
```

Set a password for the postgres user. Please remember the password you set, you need it later.

```
sudo su - postgres
$ psql
postgres=# \password postgres
postgres=# \q
```


##Phoenix

With all this things in place we can install the elixir package manager and phoenix.

Hint: You should check if there is a newer version than 1.0.1!

```
mix local.hex
mix archive.install https://github.com/phoenixframework/phoenix/releases/download/v1.0.1/phoenix_new-1.0.1.ez
```


Create a new project is easy.

```
mix phoenix.new $APPNAME
cd $APPNAME
```

Now you need your psql user and the password you set and configure it in `config/dev.exs`.


Installing all the dependencies and create the database.


```
mix deps.get
mix ecto.create
```

Start the server

```
mix phoenix.server
```

Happy coding!