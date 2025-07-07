export default async function inc(...args) {
  const files = Array.isArray(args[0]) ? args[0] : args;
  const base = app?.path || './src/';

  const results = await Promise.all(
    files.map(async (fileName) => {
      const fullPath = base + fileName + '.js'; // Simple, always from app.path

      try {
        // console.log(`%c Loaded: ${fullPath}`, 'color: green; font-weight: bold;');//dev only
        return await import(fullPath);
      } catch (error) {
        console.error(
          `%c Failed to load component: ${fullPath}`,
          'background:#e1bee7; padding:3px;',
          error
        );
      }
    })
  );

  return results;
}
