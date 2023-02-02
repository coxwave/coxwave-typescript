const path = require('path');
const pkg = require(path.join(process.cwd(), 'package.json'));

exports.getName = () => pkg.name.substring('@coxwave/'.length);

exports.getVersion = () => pkg.version;
