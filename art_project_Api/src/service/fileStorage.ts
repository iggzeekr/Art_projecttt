import fs from 'fs';

export const fileStorage = {
  uploadFileAsync: async (file: File): Promise<string> => {
    if (fs.existsSync('uploads') === false) {
      fs.mkdirSync('uploads');
    }

    const projectDir = process.cwd();
    const filePath = `${projectDir}/src/uploads/${file.name}`;
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(file.arrayBuffer());
    return filePath;
  },

  getFileAsync: async (id: string): Promise<File | null> => {
    const projectDir = process.cwd();
    const filePath = `${projectDir}/src/uploads/${id}`;
    if (fs.existsSync(filePath) === false) {
      return null;
    }

    const file = fs.readFileSync(filePath);
    return new File([file], id);
  },
};
