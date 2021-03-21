---
published: true
description: How I setup my Python projects with Poetry
categories: [blog]
tags: [Python, Poetry, GitLab, FlakeHell, Flake8, isort]
layout: post
---

As you might know I am more of a ruby programmer.
But from time to time I use different things, like Python.

That is why we talk about my Python setup today.
A few things have happened since I last built some projects with Python.
One of these things is [Poetry](https://python-poetry.org/) and the `pyproject.toml`.

## The Tools

Let's talk quickly about Poetry which promises: 
"Python packaging and dependency management made easy".
The main focus is on dependency management, 
for example Python finally gets a dependency lock file like ruby or npm.
It also handles virtual environments for you, which removes the need for 
`virtualenv` and similar tools.


And it makes use of the new `pyproject.toml` file.
Which is one config file to configure all tools.
Read more about it here: [What the heck is pyproject.toml?](https://snarky.ca/what-the-heck-is-pyproject-toml/)

FlakeHell is like the old Flake we all loved, only cooler!
It allows to integrate all linter into one thing and run them all together.

## My Setup

Enough talk let's look at my current setup for a project.
This is my `pyproject.toml` file.

```
[tool.poetry]
name = "My Python Project"
version = "0.1.0"
description = "Python Project goes Brrrrrr"
authors = ["Me <email>"]
license = "BSD"

[tool.poetry.dependencies]
python = "^3.9"
pydantic = "*"

[tool.poetry.dev-dependencies]
pytest = "*"
sphinx = "*"
flakehell = "*"
pep8-naming = "*"
flake8-2020 = "*"
flake8-use-fstring = "*"
flake8-docstrings = "*"
flake8-isort = "*"
flake8-black = "*"

[tool.pytest.ini_options]
minversion = "6.0"
addopts = "--ff -ra -v"
python_functions = [
    "should_*", 
    "test_*",
]
testpaths = [
    "tests",
    "builder",
]

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"

[[tool.poetry.source]]
name = "gitlab"
url = "https://$GITLAB/api/v4/projects/9999/packages/pypi/simple"

[tool.flakehell]
max_line_length = 100
show_source = true

[tool.isort]
multi_line_output = 3
include_trailing_comma = true
force_grid_wrap = 0
use_parentheses = true
ensure_newline_before_comments = true
line_length = 100

[tool.black]
line-length = 100

[tool.flakehell.plugins]
pyflakes = ["+*"]
pycodestyle = ["+*"]
pep8-naming = ["+*"]
"flake8-*" = ["+*"]

[tool.flakehell.exceptions."tests/"]
flake8-docstrings = ["-*"]
```

Let's look at this in detail.
We have `[tool.poetry.dev-dependencies]` where we list all our dev dependencies.
Big surprise I know :D. 
First we see pytest for tests and sphinx for docs
and as already mentioned at the start I use FlakeHell with these plug-ins:

* pep8-naming
* flake8-2020
* flake8-use-fstring
* flake8-docstrings
* flake8-isort
* flake8-black

Checkout [awesome-flake8-extensions](https://github.com/DmytroLitvinov/awesome-flake8-extensions) and choose your own adventure!

All the configuration needed for pytest is in the tag `[tool.pytest.ini_options]`.

### Gitlab 

Did you know that GitLab can host PyPI packages in the Package Registry?
Package Registry is a feature which allows to publish 
private pip packages into a PyPI Package Registry.

We can deploy pip packages like this for example.
Where `9999` is our project id which we want to use as Package Registry.

```
deploy-package:
  stage: deploy
  only:
    - tags
  script:
   - python -m pip install twine
   - python setup.py sdist bdist_wheel
   - twine upload
       --username gitlab-ci-token
       --password $CI_JOB_TOKEN
       --repository-url $CI_API_V4_URL/projects/9999/packages/pypi
       dist/*
```

And to consume the pip packages I added:

```
[[tool.poetry.source]]
name = "gitlab"
url = "https://$GITLAB/api/v4/projects/9999/packages/pypi/simple"
```

Depending on your GitLab config you need some authentication for that,
which you can easily do with:

```
poetry config http-basic.gitlab __token__ $GITLAB_TOKEN
``` 

Checkout the [GitLab documentation](https://docs.gitlab.com/ee/user/packages/pypi_repository/) for all the details.

### How to use it

Now with all this setup in place I still create a small Makefile.
Reason to create a Makefile is that this allows you to type even less.

```
install:
    poetry install
format:
    poetry run isort src tests
    poetry run black src tests
lint:
    poetry run flakehell lint src tests
test:
    poetry run pytest
```

As we can see here `format`, `lint` and `test` become super easy because all the setup code 
is in `pyproject.toml`.