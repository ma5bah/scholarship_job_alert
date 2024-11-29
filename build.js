// const {build} = require('esbuild')
// const path = require('path')
// const {esbuildDecorators} = require('@anatine/esbuild-decorators')
import {build} from 'esbuild'
import path from 'path'
import {esbuildDecorators} from '@anatine/esbuild-decorators'


const cwd = process.cwd()
const outfile = path.resolve(cwd, 'output.cjs')
const tsconfig = path.resolve(cwd, 'tsconfig.json')
const entryPoints = [path.resolve(cwd, 'src/bot.ts')]
const config = {
    platform: 'node',
    target: ['node20'],
    format: 'cjs',
    bundle: true,
    keepNames: true,
    plugins: [
        esbuildDecorators({
            tsconfig,
            cwd
        }),
    ],
    tsconfig,
    entryPoints,
    outfile,
    external: [
    ]
}

build(config)