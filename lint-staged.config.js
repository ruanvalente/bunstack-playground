export default {
  '*.{ts,tsx,js,jsx}': (filenames) => {
    const eslintFiles = filenames.filter((file) => !file.endsWith('.d.ts'));
    const tsFiles = filenames.filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'));

    const commands = [];

    if (eslintFiles.length > 0) {
      commands.push(`eslint --max-warnings=0 ${eslintFiles.join(' ')}`);
    }

    if (tsFiles.length > 0) {
      commands.push(`tsc --noEmit --project apps/web/tsconfig.app.json`);
    }

    return commands;
  },
};
