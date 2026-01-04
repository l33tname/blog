---
published: true
description: Remote deploy with nix flakes
categories: [blog]
tags: [nix, nixos, flake, linux]
layout: post
---

I love the fact that nix systems configurations can be stored
in a git repository and then remotely applied via ssh.

There is the good resource in the [NixOS & Flakes Book][remote-deploy] on the topic of remote deployment.
And everyone tells you to use flakes which allows you a more straight forward way to track the used nixpkg versions.

But I was not able to find any good examples of a flake to start out.
Nix people tend to have very convoluted and complicated setups.

As it turns out a minimal config can be very simple:

```
$ cat flake.nix
{
  description = "Basic system deploy Flake";
  inputs = {
    #nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs @ {
    self,
    nixpkgs,
    ...
  }: {
    nixosConfigurations = {
      systemA = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        modules = [
          ./config.nix
        ];
        specialArgs = {inherit inputs;};
      };
    };
  };
}
```

The used nixpkgs version is defined in inputs.
I used unstable but you can switch that to a released version.
This is reproducible even for unstable as flakes stores a hash for the used version in `flake.lock`.

This can and should be updated from time to time with:
`nix flake update` and `nix flake show` can show you all the configured targets.

The `./config.nix` is just the file you had in `/etc/nixos/configuration.nix`.

This can now be used to deploy assuming the ssh setup is done correctly.

```
nixos-rebuild switch --flake .#systemA --target-host example.com
```

### Bonus Formatter

Select a formatter to run `nix fmt` to format all files in this directory.
This is done by adding a `formatter.x86_64-linux`.

Example:

```
...
  }: {
    formatter.x86_64-linux = nixpkgs.legacyPackages.x86_64-linux.alejandra;
    nixosConfigurations = {
      systemA = nixpkgs.lib.nixosSystem {
...
```


[remote-deploy]: [https://nixos-and-flakes.thiscute.world/best-practices/remote-deployment]
