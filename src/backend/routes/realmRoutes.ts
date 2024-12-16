const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.get('/export-realm', (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; send: (arg0: string) => void; }) => {
  console.log('Database export triggered!');
  exec('adb pull /data/data/com.yourapp.package/files/your-database.realm ./downloaded-database.realm', (err: { message: any; }, stdout: any, stderr: any) => {
    if (err) {
      console.error('Error pulling the database:', err.message);
      res.status(500).send('Failed to pull the database.');
      return;
    }
    res.send('Database pulled successfully!');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
