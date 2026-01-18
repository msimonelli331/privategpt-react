import { Checkbox } from '@/components/ui/checkbox';
import { PrivategptClient } from '@/lib/pgpt';
import { getFullBaseUrl, cn } from '@/lib/utils';
import { useFiles } from 'privategpt-sdk-web/react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export function Edit() {
  const navigate = useNavigate();

  // Extract hostname from query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const hostname = urlParams.get('hostname') || '';
  const [systemPrompt, setSystemPrompt] = useLocalStorage<string>(
    `${hostname}-system-prompt`,
    '',
  );
  const [selectedFiles, setSelectedFiles] = useLocalStorage<string[]>(
    'selected-files',
    [],
  );
  const { files, deleteFile, isUploadingFile, isFetchingFiles } =
    useFiles({
      client: PrivategptClient.getInstance(getFullBaseUrl(hostname)),
      fetchFiles: true,
    });

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 justify-between flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <p className="text-xl font-semibold text-gray-900">Edit Instance</p>
          <ArrowLeft onClick={() => navigate(-1)} />
        </header>
        <main className="grid flex-1 gap-4 p-4 md:grid-cols-1">
          <div
            className="hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <form className="grid w-full items-start gap-6 sticky top-20">
              <>
                <fieldset
                  className={cn('grid gap-6 rounded-lg border p-4', {
                    'bg-muted/50': isUploadingFile || isFetchingFiles,
                  })}
                >
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Files
                  </legend>
                  {isFetchingFiles ? (
                    <p>Fetching files...</p>
                  ) : (
                    <div className="grid gap-3">
                      {files && files.length > 0 ? (
                        files.map((file, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <p>{file.fileName}</p>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="size-6"
                              onClick={(e) => {
                                e.preventDefault();
                                deleteFile(file.fileName);
                                setSelectedFiles(
                                  selectedFiles.filter(
                                    (f) => f !== file.fileName,
                                  ),
                                );
                              }}
                            >
                              x
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p>No files ingested</p>
                      )}
                      {isUploadingFile && <p>Uploading file...</p>}
                    </div>
                  )}
                </fieldset>
                <fieldset
                  className={cn('grid gap-6 rounded-lg border p-4', {
                    'bg-muted/50': isUploadingFile || isFetchingFiles,
                  })}
                >
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Ask to your docs (if none is selected, it will ask to
                    all of them)
                  </legend>
                  {isFetchingFiles ? (
                    <p>Fetching files...</p>
                  ) : (
                    <div className="grid gap-3">
                      {files && files.length > 0 ? (
                        files.map((file, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <p>{file.fileName}</p>
                            <Checkbox
                              checked={selectedFiles.includes(
                                file.fileName,
                              )}
                              onCheckedChange={() => {
                                const isSelected = selectedFiles.includes(
                                  file.fileName,
                                );
                                setSelectedFiles(
                                  isSelected
                                    ? selectedFiles.filter(
                                      (f) => f !== file.fileName,
                                    )
                                    : [...selectedFiles, file.fileName],
                                );
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <p>No files ingested</p>
                      )}
                      {isUploadingFile && <p>Uploading file...</p>}
                    </div>
                  )}
                </fieldset>
              </>

              <div className="grid gap-3">
                <Label htmlFor="content">System prompt</Label>
                <Textarea
                  id="content"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are a..."
                  className="min-h-[9.5rem]"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white "
                >
                  Edit PrivateGPTInstance
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}