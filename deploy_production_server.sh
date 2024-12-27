#!/bin/bash

# if node_modules is not present, install it
if [ ! -d "node_modules" ]; then
  pnpm install;
fi
pnpm run build;
tar -czvf dist.tar.gz dist/ production.config.js package.json;

scp .env ma5bah_vm:~/scholarship_machine/;
scp dist.tar.gz ma5bah_vm:~/scholarship_machine/;

ssh ma5bah_vm << EOF
  export PNPM_HOME="$HOME/.local/share/pnpm"
  export PATH="$PNPM_HOME/bin:$PATH"

  cd ~/scholarship_machine;
  tar -xzvf dist.tar.gz;

  pnpm install;
  rm dist.tar.gz;

  ~/.local/share/pnpm/pm2 restart production.config.js;
EOF

