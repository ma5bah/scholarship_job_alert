# scholarship_job_alerts
A repository to store the code for scholarship and job alerts

# Setup
To setup the project, follow the instructions below:

1. Clone the repository by running the command below:
```bash
  git clone
```
2. Change into the project directory by running the command below:
```bash
  cd scholarship_job_alerts
```
3. Install the required packages by running the command below:
```bash
  pnpm install
```
4. Start the project by running the command below:
```bash
  pnpm exec swc ./src -d dist && node --env-file=.env dist/src/main.js
```