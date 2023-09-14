# as-command

A command line arguments parser for [AssemblyScript](https://www.assemblyscript.org/).

## Installation

```sh
npm install as-command --save
```

## Usage

```ts
import command from 'as-command'

const program = command
  .name('pizza-cli')
  .version('4.1.79')
  .description('Order your pizza')
  .option('-c, --cheese', 'Add the specified type of cheese [marble]', [
    'marble',
  ])
  .option('-p, --peppers', 'Add peppers')
  .option('-t, --tomatoes', 'Add tomatoes')
  .action((args) => {
    console.log(`Preparing pizza with:`)

    if (args.has('cheese')) {
      console.log(`+ cheese: ${args.get('cheese').join(', ')}`)
    }
    if (args.has('peppers')) {
      console.log('+ peppers')
    }
    if (args.has('tomatoes')) {
      console.log('+ tomatoes')
    }
  })

program.parse(process.argv)
```
