export const editors = [
  { id: 'vscode', name: 'VS Code', url: (filename, line = 1) => `vscode://file${filename}:${line}` },
  { id: 'rubymine', name: 'RubyMine', url: (filename, line = 1) => `rubymine://open?url=file://${filename}&line=${line}` },
  { id: 'mvim', name: 'MacVim', url: (filename, line = 1) => `mvim://open?url=file://${filename}&line=${line}` },
  { id: 'emacs', name: 'Emacs', url: (filename, line = 1) => `emacs://open?url=file://${filename}&line=${line}` },
  { id: 'mate', name: 'TextMate', url: (filename, line = 1) => `txmt://open?url=file://${filename}&line=${line}` },
  { id: 'sublime', name: 'Sublime Text', url: (filename, line = 1) => `subl://${filename}:${line}` },
];