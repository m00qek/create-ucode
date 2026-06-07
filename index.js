#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prompts from 'prompts';
import minimist from 'minimist';
import { blue, green, red, reset } from 'kolorist';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Available templates
const TEMPLATES = [
	{ title: blue('Pure ucode'), value: 'pure-ucode' },
	{ title: green('ucode + C module'), value: 'c-mod' },
];

function printHelp() {
	const available = TEMPLATES.filter(t => !t.disabled).map(t => t.value).join(', ');
	console.log([
		'Usage: create-ucode [project-name] [options]',
		'',
		'Arguments:',
		'  project-name       Directory name and PKG_NAME (default: my-ucode-app)',
		'',
		'Options:',
		'  --template, -t     Template to use: ' + available,
		'  --maintainer, -m   Maintainer string, e.g. "Name <email>"',
		'  --help, -h         Show this help message',
	].join('\n'));
}

async function init() {
	const argv = minimist(process.argv.slice(2), { string: ['_'] });

	if (argv.help || argv.h) {
		printHelp();
		return;
	}

	const argProjectName = argv._[0];
	const argTemplate = argv.template || argv.t;
	const argMaintainer = argv.maintainer || argv.m;

	const defaultProjectName = 'my-ucode-app';
	const defaultMaintainer = 'Your Name <email@example.com>';

	let result = {};

	try {
		result = await prompts(
			[
				{
					type: argProjectName ? null : 'text',
					name: 'projectName',
					message: reset('Project name:'),
					initial: defaultProjectName,
				},
				{
					type: argTemplate && TEMPLATES.find(t => t.value === argTemplate && !t.disabled) ? null : 'select',
					name: 'template',
					message: reset('Select a template:'),
					choices: TEMPLATES,
				},
				{
					type: argMaintainer ? null : 'text',
					name: 'maintainer',
					message: reset('Maintainer (Name <email>):'),
					initial: defaultMaintainer,
				}
			],
			{
				onCancel: () => {
					throw new Error(red('✖') + ' Operation cancelled');
				},
			}
		);
	} catch (cancelled) {
		console.log(cancelled.message);
		return;
	}

	const projectName = result.projectName || argProjectName || defaultProjectName;
	const template = result.template || argTemplate;
	const maintainer = result.maintainer || argMaintainer || defaultMaintainer;

	if (!template) {
		console.error(red('✖') + ' No valid template selected.');
		return;
	}

	if (path.normalize(projectName).split(path.sep).includes('..')) {
		console.error(red('✖') + ` "${projectName}" contains path traversal.`);
		return;
	}

	const root = path.resolve(process.cwd(), projectName);
	const packageName = path.basename(root);

	if (!/^[a-z0-9][a-z0-9_-]*$/.test(packageName)) {
		console.error(red('✖') + ` Invalid package name: "${packageName}". Use only lowercase letters, numbers, hyphens, and underscores.`);
		return;
	}

	if (fs.existsSync(root) && fs.readdirSync(root).length > 0) {
		let overwrite;
		try {
			({ overwrite } = await prompts(
				{
					type: 'confirm',
					name: 'overwrite',
					message: reset(`Directory "${packageName}" is not empty. Overwrite?`),
					initial: false,
				},
				{
					onCancel: () => { throw new Error(red('✖') + ' Operation cancelled'); },
				}
			));
		} catch (cancelled) {
			console.log(cancelled.message);
			return;
		}
		if (overwrite === undefined) {
			console.log(red('✖') + ' Operation cancelled');
			return;
		}
		if (!overwrite) return;
		for (const f of fs.readdirSync(root)) {
			fs.rmSync(path.join(root, f), { recursive: true, force: true });
		}
	} else if (!fs.existsSync(root)) {
		fs.mkdirSync(root, { recursive: true });
	}

	const templateDir = path.resolve(__dirname, 'templates', template);

	if (!fs.existsSync(templateDir)) {
		console.error(red('✖') + ` Template directory "${template}" does not exist.`);
		return;
	}

	const write = (file, content) => {
		const targetPath = path.join(root, file.replace('{{PKG_NAME}}', packageName));
		const dir = path.dirname(targetPath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		
		if (content) {
			fs.writeFileSync(targetPath, content);
		} else {
			copy(path.join(templateDir, file), targetPath);
		}
	};

	function copy(src, dest) {
		const stat = fs.statSync(src);
		if (stat.isDirectory()) {
			copyDir(src, dest);
		} else {
			const buf = fs.readFileSync(src);
			if (buf.includes(0)) {
				fs.writeFileSync(dest, buf);
				return;
			}
			let content = buf.toString('utf-8');
			content = content.replace(/{{PKG_NAME}}/g, packageName);
			content = content.replace(/{{MAINTAINER}}/g, maintainer);
			content = content.replace(/{{YEAR}}/g, new Date().getFullYear());
			fs.writeFileSync(dest, content);
		}
	}

	function copyDir(srcDir, destDir) {
		fs.mkdirSync(destDir, { recursive: true });
		for (const file of fs.readdirSync(srcDir)) {
			const srcFile = path.resolve(srcDir, file);
			const destFile = path.join(destDir, file.replace('{{PKG_NAME}}', packageName));
			copy(srcFile, destFile);
		}
	}

	const files = fs.readdirSync(templateDir);
	for (const file of files) {
		write(file);
	}

	console.log(`\nDone. Now run:\n`);
	console.log(green(`  cd ${projectName}`));
	console.log(green(`  make test`));
	console.log();
}

init().catch((e) => {
	console.error(e);
});
