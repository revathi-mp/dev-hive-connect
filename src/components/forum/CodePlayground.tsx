
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Play, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodePlaygroundProps {
  code: string;
  language: string;
}

export function CodePlayground({ code, language }: CodePlaygroundProps) {
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("code");
  const { toast } = useToast();

  const runCode = () => {
    setIsRunning(true);
    setActiveTab("result");
    
    try {
      let result = '';
      
      if (language === 'javascript' || language === 'js') {
        // Create a sandbox for JavaScript execution
        const sandbox = function(code: string) {
          const console = {
            log: function(...args: any[]) {
              result += args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ') + '\n';
            },
            error: function(...args: any[]) {
              result += 'Error: ' + args.map(arg => String(arg)).join(' ') + '\n';
            },
            warn: function(...args: any[]) {
              result += 'Warning: ' + args.map(arg => String(arg)).join(' ') + '\n';
            }
          };
          
          try {
            // Execute the code with the controlled console
            // eslint-disable-next-line no-new-func
            const fn = new Function('console', code);
            fn(console);
            return result || 'Code executed successfully (no output)';
          } catch (error) {
            return `Error: ${(error as Error).message}`;
          }
        };
        
        result = sandbox(code);
        toast({
          description: "JavaScript code executed",
        });
      } else if (language === 'html') {
        // For HTML, create the preview directly
        result = code;
        toast({
          description: "HTML preview generated",
        });
      } else if (language === 'css') {
        result = 'CSS preview not supported in standalone mode. Use with HTML.';
        toast({
          description: "CSS requires HTML to preview",
        });
      } else if (language === 'python' || language === 'py') {
        result = 'Python execution requires server-side integration.\nConsider using an online Python interpreter or local environment.';
        toast({
          description: "Python execution not available in browser",
        });
      } else {
        result = `Running ${language} code is not supported in this playground.`;
        toast({
          description: `${language} is not supported in this playground`,
        });
      }
      
      setOutput(result);
    } catch (error) {
      setOutput(`Error executing code: ${(error as Error).message}`);
      toast({
        variant: "destructive",
        description: `Error: ${(error as Error).message}`,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // For HTML preview rendering
  const renderHTML = () => {
    if (language !== 'html') return null;
    
    // Create a secure HTML preview
    return (
      <iframe
        title="HTML Preview"
        srcDoc={code}
        className="w-full h-[200px] border-0"
        sandbox="allow-scripts"
      />
    );
  };

  const resetOutput = () => {
    setOutput('');
    setActiveTab("code");
    toast({
      description: "Output cleared",
    });
  };

  return (
    <Card className="mt-2 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center p-2 bg-muted">
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            {(language === 'html' || output) && (
              <TabsTrigger value="result">Result</TabsTrigger>
            )}
          </TabsList>
          
          <div className="flex gap-1">
            {output && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={resetOutput} 
                className="h-7 px-2 text-xs flex items-center gap-1"
              >
                <RotateCw className="h-3 w-3" />
                Reset
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={runCode} 
              disabled={isRunning}
              className="h-7 px-2 text-xs flex items-center gap-1"
            >
              <Play className="h-3 w-3" />
              Run
            </Button>
          </div>
        </div>
        
        <TabsContent value="code" className="p-0 m-0">
          <pre className="bg-black text-green-500 p-4 overflow-x-auto text-sm">
            <code>{code}</code>
          </pre>
        </TabsContent>
        
        <TabsContent value="result" className="p-0 m-0">
          {language === 'html' ? (
            renderHTML()
          ) : (
            <pre className="bg-black text-white p-4 overflow-x-auto text-sm min-h-[100px] max-h-[200px]">
              {output || 'Click "Run" to see the result'}
            </pre>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
