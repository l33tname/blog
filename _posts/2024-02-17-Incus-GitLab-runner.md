---
published: true
description: Setup a custom Incus GitLab runner
categories: [blog]
tags: [LXD, Incus, GitLab, GitLab runner, cloud-config]
layout: post
---

With the recent fork and [drama](https://discuss.linuxcontainers.org/t/important-notice-for-lxd-users-image-server/18479) around LXD it might be time to
give [Incus](https://linuxcontainers.org/incus/) a chance.

Using Incus as GitLab runner is nice because it provides you with a
simple interface to run containers and VMs for the cases where Docker is
not enough.
Helpfully there is a [custom LXD GitLab runner](https://docs.gitlab.com/runner/executors/custom_examples/lxd.html) provided by GitLab.

Based on that I created a custom Incus GitLab runner.
Checkout: <https://github.com/fliiiix/github-incus-runner>

This can be easily integrated into the deployment system used to
setup GitLab runners. (Thinks [Ansible](https://www.ansible.com/))

It also assumes that you already installed Incus on the runner.
To achieve that you can follow the [official documentation](https://linuxcontainers.org/incus/docs/main/installing/) for that.
Or take some inspiration from the next section.

## Installing Incus

Look at the [official documentation](https://linuxcontainers.org/incus/docs/main/installing/).
This is just a quick summary on how I did it.

```
mkdir -p /etc/apt/keyrings/
curl -fsSL https://pkgs.zabbly.com/key.asc -o /etc/apt/keyrings/zabbly.asc

sh -c 'cat <<EOF > /etc/apt/sources.list.d/zabbly-incus-stable.sources
Enabled: yes
Types: deb
URIs: https://pkgs.zabbly.com/incus/stable
Suites: $(. /etc/os-release && echo ${VERSION_CODENAME})
Components: main
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/zabbly.asc

EOF'

apt-get update
apt-get install incus

sudo adduser ubuntu incus-admin
```

Big Kudos to [zabbly](https://zabbly.com/) and Stéphane Graber for providing pre-built images!

And to setup Incus I used cloud-config [runcmd](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#run-commands-on-first-boot).

```
#cloud-config
runcmd:
 - 'incus admin init --preseed < /etc/incus.seed && touch /etc/incus.init'
```

This assumes that you created your preseed config:

```
$ cat /etc/incus.seed
config: {}
networks:
- config:
    ipv4.address: auto
    ipv6.address: none
  description: ""
  name: incusbr0
  type: ""
  project: default
storage_pools:
- config:
    size: 200GiB
  description: ""
  name: default
  driver: zfs
profiles:
- config: {}
  description: ""
  devices:
    eth0:
      name: eth0
      network: incusbr0
      type: nic
    root:
      path: /
      pool: default
      type: disk
  name: default
projects: []
cluster: null
```
