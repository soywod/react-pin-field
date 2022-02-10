{
  description = "React component for entering PIN codes";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-21.11";
    utils.url = "github:numtide/flake-utils";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, utils, ... }:
    utils.lib.eachDefaultSystem
      (system:
        let
          name = (builtins.fromJSON (builtins.readFile ./package.json)).name;
          pkgs = import nixpkgs { inherit system; };
          yarn-run = "yarn run --offline --ignore-scripts --ignore-engines --";
        in
        rec {
          # nix build
          defaultPackage = pkgs.yarn2nix-moretea.mkYarnPackage {
            inherit name;
            src = ./.;
            extraBuildInputs = with pkgs; [
              ripgrep
              rnix-lsp
              nixpkgs-fmt
              nodePackages.prettier
              nodePackages.typescript
              nodePackages.typescript-language-server
              nodePackages.vscode-json-languageserver
              nodePackages.vscode-css-languageserver-bin
            ];
            configurePhase = ''
              ln -s $node_modules node_modules
            '';
            buildPhase = ''
              ${yarn-run} next build
              ${yarn-run} next export -o $out
            '';
            installPhase = ''
              exit
            '';
            distPhase = ''
              exit
            '';
          };

          # nix develop
          devShell = pkgs.mkShell {
            inputsFrom = [ self.defaultPackage.${system} ];
          };
        }
      );
}
