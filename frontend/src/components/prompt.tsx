import { CornerDownLeft, Paperclip, StopCircle, Menu } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFiles, usePrompt } from 'privategpt-sdk-web/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { PrivategptApi } from 'privategpt-sdk-web';
import { PrivategptClient } from '@/lib/pgpt';
import { getFullBaseUrl } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { marked } from 'marked';
import { useLocalStorage } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';

const MODES = [
  {
    value: 'query',
    title: 'Query docs',
    description:
      'Uses the context from the ingested documents to answer the questions',
  },
  {
    value: 'search',
    title: 'Search files',
    description: 'Fast search that returns the 4 most related text chunks',
  },
  {
    value: 'prompt',
    title: 'Prompt',
    description: 'Prompt the model to perform a task. No context from files',
  },
  {
    value: 'chat',
    title: 'LLM Chat',
    description: 'Freeform char with the model. No context from files',
  },
] as const;

export function Prompt() {
  const navigate = useNavigate();
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useLocalStorage<(typeof MODES)[number]['value']>(
    'pgpt-prompt-mode',
    'prompt',
  );
  const [sources, setSources] = useLocalStorage(
    'pgpt-sources',
    [] as PrivategptApi.Chunk[],
  );
  // Extract hostname from query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const hostname = urlParams.get('hostname') || '';
  const [input, setInput] = useState('');
  const [prompt, setPrompt] = useState<string>('');
  const [systemPrompt, setSystemPrompt] = useLocalStorage<string>(
    'system-prompt',
    '',
  );
  const [selectedFiles, setSelectedFiles] = useLocalStorage<string[]>(
    'selected-files',
    [],
  );
  const { addFile, files, deleteFile, isUploadingFile, isFetchingFiles } =
    useFiles({
      client: PrivategptClient.getInstance(getFullBaseUrl(hostname)),
      fetchFiles: true,
    });

  const { completion, isLoading, stop, setCompletion } = usePrompt({
    client: PrivategptClient.getInstance(getFullBaseUrl(hostname)),
    prompt,
    onFinish: ({ sources }) => {
      setSources(sources);
      setTimeout(() => {
        messageRef.current?.focus();
      }, 100);
    },
    useContext: mode === 'query',
    enabled: prompt.length > 0 && ['query', 'prompt'].includes(mode),
    includeSources: mode === 'query',
    systemPrompt,
    contextFilter: {
      docsIds: ['query', 'search'].includes(mode)
        ? selectedFiles.reduce((acc, fileName) => {
          const groupedDocs = files?.filter((f) => f.fileName === fileName);
          if (!groupedDocs) return acc;
          const docIds = [] as string[];
          groupedDocs.forEach((d) => {
            docIds.push(...d.docs.map((d) => d.docId));
          });
          acc.push(...docIds);
          return acc;
        }, [] as string[])
        : [],
    },
  });

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input) return;
    const content = input.trim();
    addPrompt(content);
    if (mode === 'search') {
      searchDocs(content);
    }
  };

  const addPrompt = (message: string) => {
    setPrompt(message);
    setInput('');
  };

  const searchDocs = async (input: string) => {
    const chunks = await PrivategptClient.getInstance(
      getFullBaseUrl(hostname),
    ).contextChunks.chunksRetrieval({ text: input });
    const content = chunks.data.reduce((acc, chunk, index) => {
      return `${acc}**${index + 1}.${chunk.document.docMetadata?.file_name
        } (page ${chunk.document.docMetadata?.page_label})** \n\n ${chunk.document.docMetadata?.original_text
        } \n\n`;
    }, '');
    setCompletion(content);
  };

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [completion]);

  useEffect(() => {
    setSources([]);
  }, [prompt]);

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 justify-between flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <Button
            variant="ghost"
            onClick={() => setShowModal(true)}
            className="p-2"
          >
            <Menu className="size-4" />
          </Button>
          <div className="flex-1 flex justify-center">
            <Select value={mode} onValueChange={setMode as any}>
              <SelectTrigger
                id="mode"
                className="items-start [&_[data-description]]:hidden w-fit"
              >
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                {MODES.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <div className="grid gap-0.5">
                        <p>{mode.title}</p>
                        <p className="text-xs" data-description>
                          {mode.description}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Back to Dashboard
          </Button>
        </header>
        <main className="grid flex-1 gap-4 p-4 md:grid-cols-1 lg:grid-cols-2">
          <div
            className="hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            {/* Removed the form element that contained mode dropdown and file selection */}
            {/* File selection is now handled in the sidebar or through the modal */}
          </div>
          <div className="relative flex-col flex h-full space-y-4 flex- rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge
              variant="outline"
              className="absolute right-3 top-3 bg-muted/100"
            >
              Output
            </Badge>
            <div className="flex-1">
              <div className="flex flex-col space-y-4">
                {prompt && (
                  <div
                    className={cn(
                      'h-fit p-3 grid gap-2 shadow-lg rounded-xl w-fit self-start',
                    )}
                  >
                    <Badge variant="outline" className="w-fit bg-muted/100">
                      user
                    </Badge>
                    <div
                      className="text-sm prose marker:text-black"
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(prompt),
                      }}
                    />
                  </div>
                )}
                {completion && (
                  <div className="h-fit p-3 grid gap-2 shadow-lg rounded-xl w-full self-end bg-violet-200">
                    <Badge variant="outline" className="w-fit bg-muted/100">
                      assistant
                    </Badge>
                    <div
                      className="text-sm prose text-black marker:text-black"
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(completion),
                      }}
                    />
                    {sources?.length > 0 && (
                      <div>
                        <p className="font-bold">Sources:</p>
                        {sources.map((source) => (
                          <p key={source.document.docId}>
                            <strong>
                              {source.document.docMetadata?.file_name as string}
                            </strong>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <form
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
              x-chunk="dashboard-03-chunk-1"
              onSubmit={handleSubmit}
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                ref={messageRef}
                disabled={isLoading}
                id="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                value={input}
                name="content"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.dispatchEvent(
                      new Event('submit', { bubbles: true }),
                    );
                  }
                }}
                autoFocus
                onChange={(event) => setInput(event.target.value)}
              />
              <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => {
                          const input = document.createElement(
                            'input',
                          ) as HTMLInputElement;
                          input.type = 'file';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement)
                              ?.files?.[0];
                            if (!file) return;
                            addFile(file);
                          };
                          input.click();
                          input.remove();
                        }}
                      >
                        <Paperclip className="size-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach File</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {isLoading ? (
                  <Button
                    type="button"
                    onClick={stop}
                    size="sm"
                    className="ml-auto gap-1.5"
                  >
                    Stop
                    <StopCircle className="size-3.5" />
                  </Button>
                ) : (
                  <Button type="submit" size="sm" className="ml-auto gap-1.5">
                    Send Message
                    <CornerDownLeft className="size-3.5" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </main>

        {/* Modal Component */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-lg p-6 w-80 max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Options</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setPrompt('');
                    setCompletion('');
                    setShowModal(false);
                  }}
                >
                  Clear Chat
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    // Navigate to edit instance page
                    navigate('/edit-instance');
                    setShowModal(false);
                  }}
                >
                  Edit Instance
                </Button>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}