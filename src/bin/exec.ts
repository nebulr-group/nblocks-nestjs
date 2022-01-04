import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

export class Exec {
    static run(cmd: string, verbose: boolean): boolean {
        try {
            execSync(cmd, { stdio: 'pipe' });
        } catch (error) {
            if (verbose) console.error(`Failed to run cmd: "${cmd}"`, error);
            return false;
        }
        return true;
    }

    static writeFile(path: string, content: string): boolean {
        try {
            writeFileSync(path, content, { encoding: 'utf8' });
        } catch (error) {
            console.error(`Failed to write file: "${path}"`, error);
            throw error;
        }
        return true;
    }

    static readFile(path: string): string {
        try {
            return readFileSync(path, { encoding: 'utf8' });
        } catch (error) {
            console.error(`Failed to read file: "${path}"`, error);
            throw error;
        }
    }
}
