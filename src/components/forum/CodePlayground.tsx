
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Play, Edit2, Save, MousePointerClick } from "lucide-react";

interface CodePlaygroundProps {
  code: string;
  language: string;
  isEditable?: boolean;
  onCodeChange?: (newCode: string) => void;
}

export function CodePlayground({
  code: initialCode,
  language,
  isEditable = false,
  onCodeChange
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);
  const [error, setError] = useState<string | null>(null);

  // Reset editedCode when code prop changes
  useEffect(() => {
    setCode(initialCode);
    setEditedCode(initialCode);
  }, [initialCode]);

  const handleRun = () => {
    setError(null);
    setOutput('');
    
    try {
      if (language.toLowerCase() === 'javascript') {
        // For JavaScript, use try-catch to handle errors in code execution
        try {
          // Create a sandbox function from the code
          const sandboxFunction = new Function(`
            try {
              const console = {
                log: function(...args) {
                  window._playgroundOutput = (window._playgroundOutput || '') + args.join(' ') + '\\n';
                },
                error: function(...args) {
                  window._playgroundOutput = (window._playgroundOutput || '') + 'Error: ' + args.join(' ') + '\\n';
                },
                warn: function(...args) {
                  window._playgroundOutput = (window._playgroundOutput || '') + 'Warning: ' + args.join(' ') + '\\n';
                }
              };
              
              // Execute the code and capture return value
              let result = (function() { ${code}; return null; })();
              
              // Return both console output and function result
              return { 
                consoleOutput: window._playgroundOutput || '', 
                result: result 
              };
            } catch (e) {
              return { error: e.message };
            } finally {
              delete window._playgroundOutput;
            }
          `);
          
          const result = sandboxFunction();
          
          if (result.error) {
            throw new Error(result.error);
          }
          
          let outputText = '';
          
          if (result.consoleOutput) {
            outputText += result.consoleOutput;
          }
          
          if (result.result !== undefined && result.result !== null) {
            outputText += (outputText ? '\n' : '') + String(result.result);
          }
          
          setOutput(outputText || 'Code executed successfully (no output)');
          toast({
            description: "Code executed successfully",
          });
        } catch (jsError) {
          setError(jsError.message);
          throw jsError; // re-throw to handle in outer catch
        }
      } else if (language.toLowerCase() === 'html') {
        // Create a sandbox iframe and render HTML
        const sandboxId = 'html-sandbox-' + Math.random().toString(36).substr(2, 9);
        const sandboxContainer = document.createElement('div');
        sandboxContainer.id = sandboxId;
        sandboxContainer.style.display = 'none';
        document.body.appendChild(sandboxContainer);
        
        try {
          // Create iframe safely without modifying read-only properties
          const iframe = document.createElement('iframe');
          // Set attributes using appropriate methods
          iframe.setAttribute('sandbox', 'allow-scripts');
          iframe.srcdoc = code;
          iframe.style.width = '100%';
          iframe.style.height = '200px';
          iframe.style.border = 'none';
          
          // Replace the output area with the iframe
          const outputArea = document.getElementById('output-' + sandboxId);
          if (outputArea) {
            outputArea.innerHTML = '';
            outputArea.appendChild(iframe);
          }
          
          setOutput('HTML rendered below');
          
          // Create a div to display the rendered HTML
          const renderedHtml = document.createElement('div');
          renderedHtml.id = 'output-' + sandboxId;
          renderedHtml.className = 'mt-2 border rounded p-2';
          sandboxContainer.appendChild(renderedHtml);
          renderedHtml.appendChild(iframe);
          
          toast({
            description: "HTML preview updated",
          });
        } catch (htmlError) {
          setError(htmlError.message);
          document.body.removeChild(sandboxContainer);
          throw htmlError;
        }
      } else if (language.toLowerCase() === 'css') {
        try {
          // Create a unique ID for this CSS
          const styleId = 'css-sandbox-' + Math.random().toString(36).substr(2, 9);
          
          // Remove any previous style with this ID
          const existingStyle = document.getElementById(styleId);
          if (existingStyle && existingStyle.parentNode) {
            existingStyle.parentNode.removeChild(existingStyle);
          }
          
          // Create style element
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = code;
          document.head.appendChild(style);
          
          setOutput('CSS applied to page - Check the styles in the browser');
          toast({
            description: "CSS styles applied",
          });
        } catch (cssError) {
          setError(cssError.message);
          throw cssError;
        }
      } else if (language.toLowerCase() === 'python') {
        setOutput("Python code can't be executed directly in the browser. Consider using a Python web service or API.");
        toast({
          description: "Python execution not supported in browser",
          variant: "destructive"
        });
      } else {
        setOutput(`Running ${language} code is not supported in this playground`);
        toast({
          description: `${language} execution not supported`,
          variant: "destructive"
        });
      }
    } catch (error) {
      setError(error.message);
      setOutput(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedCode(code);
  };

  const handleSave = () => {
    if (editedCode.trim() === '') {
      toast({
        title: "Error",
        description: "Code cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setCode(editedCode);
    setIsEditing(false);
    setOutput('');
    setError(null);
    
    if (onCodeChange) {
      onCodeChange(editedCode);
    }
  };

  return (
    <div className="rounded-md border bg-muted p-4 my-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{language}</span>
        <div className="space-x-2">
          {isEditable && (
            isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-1"
              >
                <Save className="h-3 w-3" />
                Save
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
            )
          )}
          <Button
            variant="default"
            size="sm"
            onClick={handleRun}
            className="flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            Run
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Textarea
          value={editedCode}
          onChange={(e) => setEditedCode(e.target.value)}
          className="font-mono text-sm min-h-[100px] mb-2"
          placeholder={`Enter your ${language} code here...`}
        />
      ) : (
        <pre className="bg-background p-2 rounded overflow-x-auto">
          <code>{code}</code>
        </pre>
      )}

      {(output || error) && (
        <div className={`mt-2 p-2 bg-background rounded-md ${error ? 'border-red-500 border' : ''}`}>
          <h4 className="text-sm font-medium mb-1">
            {error ? 'Error:' : 'Output:'}
          </h4>
          <pre className={`text-sm ${error ? 'text-red-500' : ''}`}>{error || output}</pre>
          
          {/* Container for HTML preview if applicable */}
          {language.toLowerCase() === 'html' && !error && (
            <div className="mt-2 border rounded p-2">
              <iframe
                srcDoc={code}
                className="w-full min-h-[150px] border-0"
                title="HTML Preview"
                sandbox="allow-scripts"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
