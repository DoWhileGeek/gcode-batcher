import spawn from 'await-spawn'
import path from 'path'
import fs from 'fs'

import config from './config.json'

const formatFilename = (name, quantity) =>
    `${quantity}${config.countFormat}${name}${config.template}` //${config.template}`

const sliceQuantity = async ({ name, file, out }, quantity) => {
    const args = [
        '-gcode',
        '--output-filename-format',
        formatFilename(name, quantity),
        '--output',
        path.join(config.outputDir, name),
        '--duplicate',
        quantity,
        file,
    ]

    console.log(config.program, args.join(' '))
    try {
        const stdout = await spawn(config.program, args)
        console.log(stdout.toString())
    } catch (e) {
        console.log(e.stderr.toString())
    }
}

const sliceModel = async ({ quantities, ...model }) => {
    fs.mkdirSync(path.join(config.outputDir, model.name), { recursive: true })

    await Promise.all(
        quantities.map((quantity) => sliceQuantity(model, quantity))
    )
}

const main = () => {
    config.models.map(sliceModel)
}

//const output = await spawn('ls')

await main()
