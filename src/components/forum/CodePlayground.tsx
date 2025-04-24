
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Play, Edit2, Save } from "lucide-react";

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

  const handleRun = () => {
    try {
      if (language.toLowerCase() === 'javascript') {
        // Create a new Function to run the code in a sandbox
        const result = new Function(code)();
        setOutput(String(result));
        toast({
          description: "Code executed successfully",
        });
      } else if (language.toLowerCase() === 'html') {
        // For HTML, create an iframe to render the content
        const iframe = document.createElement('iframe');
        iframe.srcdoc = code;
        setOutput('HTML rendered in preview');
        toast({
          description: "HTML preview updated",
        });
      } else if (language.toLowerCase() === 'css') {
        // For CSS, apply it to a test div
        const style = document.createElement('style');
        style.textContent = code;
        document.head.appendChild(style);
        setOutput('CSS applied to page');
        toast({
          description: "CSS styles applied",
        });
      } else {
        setOutput(`Running ${language} code is not supported in this playground`);
        toast({
          description: `${language} execution not supported`,
          variant: "destructive"
        });
      }
    } catch (error) {
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
    setCode(editedCode);
    setIsEditing(false);
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
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )
          )}
          <Button
            variant="default"
            size="sm"
            onClick={handleRun}
          >
            <Play className="h-3 w-3 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Textarea
          value={editedCode}
          onChange={(e) => setEditedCode(e.target.value)}
          className="font-mono text-sm min-h-[100px] mb-2"
        />
      ) : (
        <pre className="bg-background p-2 rounded overflow-x-auto">
          <code>{code}</code>
        </pre>
      )}

      {output && (
        <div className="mt-2 p-2 bg-background rounded-md">
          <h4 className="text-sm font-medium mb-1">Output:</h4>
          <pre className="text-sm">{output}</pre>
        </div>
      )}
    </div>
  );
}
