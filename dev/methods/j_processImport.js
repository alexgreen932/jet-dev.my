export default async function j_processImport() {
    if (!this.j_import || !Array.isArray(this.j_import)) return;

    const base = app.componentPath;

    const imports = this.j_import.map(async (path) => {
        let fullPath;

        if (path.startsWith('/')) {
            fullPath = base + path.slice(1) + '.js';
            // console.log('path.slice(1): ', path.slice(1));
            // console.log('fullPath: ', fullPath);
            // console.log('base: ', base);
            // console.log('path: ', path);
        } else if (path.includes('/')) {
            fullPath = base + path + '.js';
        } else {
            fullPath = base + path + '.js';
        }

        try {
            return await import(fullPath); // ✅ directly use fullPath (already absolute)
        } catch (err) {
            const msg = `[j_import] Failed to import: ${fullPath}`;
            console.error(msg, err);
            this.log?.('error', msg);
        }
    });

    await Promise.all(imports);
    this.j_imported = true;
}
