export type SupportedLanguage =
  | "javascript"
  | "python"
  | "cpp"
  | "java";

export const codeTemplates: Record<SupportedLanguage, string> = {
  javascript: `// WeCode: JavaScript Environment

function main() {
  console.log("Hello, WeCode!");
}

main();`,

  python: `# WeCode: Python Environment

print("Hello, WeCode!")`,

  cpp: `// WeCode: C++ Environment
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, WeCode!" << endl;
    return 0;
}`,

  java: `// WeCode: Java Environment
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, WeCode!");
    }
}`,
};