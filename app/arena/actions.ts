"use server";

import fs from "fs";
import path from "path";

const DATASET_DIR = "F:\\Research\\Plant Disease Dataset\\Kaggle_real";

export async function findLabelByFilename(filename: string): Promise<string | null> {
  if (!filename) return null;
  
  try {
    if (!fs.existsSync(DATASET_DIR)) {
      return null;
    }

    const folders = fs.readdirSync(DATASET_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const folder of folders) {
      const folderPath = path.join(DATASET_DIR, folder);
      const filePath = path.join(folderPath, filename);
      
      if (fs.existsSync(filePath)) {
        return folder; // We found the exact file in this folder, so this is the label!
      }
    }
  } catch (err) {
    console.error("Error searching for file label:", err);
  }
  return null;
}
