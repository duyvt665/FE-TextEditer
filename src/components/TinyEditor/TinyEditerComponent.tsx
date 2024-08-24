import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { message } from "antd";
import "./Tiny.css";
import { Base64 } from "js-base64";
import apiService from "@/service/apiService";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import useFetchData from "@/service/component/getData";
import {
  FileTextTwoTone,
  MenuOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import MenuMobile from "@/pages/components/MenuMobile";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";

declare global {
  interface Window {
    tinymce: any;
  }
}

const TinyMCEComponent = ({ documentId, permission }: { documentId: any, permission: string }) => {
  const [editorContent, setEditorContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const editorContentRef = useRef<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [checkUpdate, setCheckUpdate] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { data: documentData } = useFetchData(
    documentId ? `/user/infor-document/${documentId}` : null
  );
  const navigate = useNavigate();
  const socketRef = useRef<any>(null);
  const isExternalUpdate = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() =>{
    if(permission !== "edit"){
      setDisabled(true);
    } else{
      setDisabled(false);
    }
  },[documentId])
 
  //SOCKET IO
  useEffect(() => {
    socketRef.current = io("ws://localhost:5555");

    socketRef.current.on("document-update", (updatedContent: string) => {
      const decodedContent = Base64.decode(updatedContent);
      if (decodedContent !== editorContentRef.current) {
        isExternalUpdate.current = true;
        setEditorContent(decodedContent);
      }
    });

    if (documentId) {
      socketRef.current.emit("join-document", documentId);
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [documentId]);

  // USEEFFECT CHECK UPDATES
  useEffect(() => {
    if (documentData) {
      loadContent();
      setCheckUpdate(true);
    }
  }, [documentData]);

  // HANDLE SHOW MENU MOBILE
  const handleShowMenuMobile = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const handleInsertPageBreak = (editor: TinyMCEEditor) => {
    const pageHeight = 1122; 
    // const margin = 20;

    const addPageBreaks = () => {
      const body = editor.getBody();
      let accumulatedHeight = 0;
      const pageBreaks = body.querySelectorAll(".page-break");
      pageBreaks.forEach((breakElem) => breakElem.remove());

      Array.from(body.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const elementNode = node as HTMLElement;
          const tempDiv = document.createElement("div");
          tempDiv.style.visibility = "hidden";
          tempDiv.style.position = "absolute";
          tempDiv.style.width = "850px";
          tempDiv.innerHTML = elementNode.outerHTML;
          document.body.appendChild(tempDiv);

          const statementHeight = tempDiv.offsetHeight;

          
          accumulatedHeight += statementHeight ;

         
          if (accumulatedHeight > pageHeight) {
            
            const pageBreak = document.createElement("div");
            pageBreak.className = "page-break";
            pageBreak.innerHTML = "<br><hr><br>"; 
            body.insertBefore(pageBreak, node);
            accumulatedHeight = statementHeight 
          }

          document.body.removeChild(tempDiv);
        }
      });
    };

    addPageBreaks();
  };

  // HANDLE EDITOR CHANGE
  const handleEditorChange = (content: string, editor: TinyMCEEditor) => {
    handleInsertPageBreak(editor);

    if (!isExternalUpdate.current) {
      setEditorContent(content);
      editorContentRef.current = content;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const base64Content = Base64.encode(content);
        socketRef.current.emit("document-update", {
          documentId,
          content: base64Content,
        });
      }, 1000);
    } else {
      isExternalUpdate.current = false;
    }
  };

  // LOAD CONTENT DOCUMENT
  const loadContent = () => {
    const base64Content = documentData?.document?.content;
    const htmlContent = Base64.decode(base64Content);
    setEditorContent(htmlContent);
    setTitle(documentData?.document?.title);
  };

  //HANDLE CREATE NEW DOCUMENT
  const handleNewDocument = () => {
    setTitle("");
    setEditorContent("");
    editorContentRef.current = "";
    setCheckUpdate(false);
    navigate("/home", { replace: true });
    socketRef.current.disconnect();
  };

  //HANDLE SAVE DOCUMENT
  const handleSave = async () => {
    setDisabled(true);
    if (title === "") {
      message.error("Please input document title!");
      setTimeout(() => setDisabled(false), 2000);
      return;
    }
    try {
      const currentContent = editorContentRef.current;
      const base64Content = Base64.encode(currentContent);
      await apiService.post("/user/add-document", {
        title: title,
        content: base64Content,
      });
      message.success("Document saved successfully!");
      setTimeout(() => setDisabled(false), 2000);
    } catch (error) {
      setTimeout(() => setDisabled(false), 2000);
    }
  };

  //HANDLE UPDATE DOCUMENT
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (checkUpdate && editorContentRef.current !== "") {
        handleUpdate();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [editorContent]);

  const handleUpdate = async () => {
    setDisabled(false);
    if (title === "") {
      message.error("Please input document title!");
      setTimeout(() => setDisabled(false), 2000);
      return;
    }
    try {
      const currentContent = editorContentRef.current;
      const base64Content = Base64.encode(currentContent);
      await apiService.post(`/user/documents-update`, {
        documentId: documentData?.document?._id,
        newTitle: title,
        newContent: base64Content,
      });
      setTimeout(() => setDisabled(false), 2000);
    } catch (error) {
      setTimeout(() => setDisabled(false), 2000);
    }
  };
  //END HANDLE UPDATE DOCUMENT

  //HANDLE IMPORT DOCUMENT
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".docx";
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        try {
          const htmlString = await convertDocxToHtml(file);
          setEditorContent(htmlString); 
        } catch (error) {
          console.error("Error converting file:", error);
        }
      }
    };
    input.click();
  };

  const convertDocxToHtml = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("File", file);

    try {
      const response = await fetch(
        `https://v2.convertapi.com/convert/docx/to/html?Secret=secret_L3bC8e6kOywgxwSy`,
        {
          method: "POST",
          body: formData,
        }
      );
      

      if (!response.ok) {
        throw new Error(`Error during conversion: ${response.statusText}`);
      }

      const result = await response.json();

      const base64Html = result.Files[0].FileData;
      let  htmlContent = Base64.decode(base64Html);
      htmlContent = htmlContent.replace(/<div class="page-break"><br><hr><br><\/div>/, '');

      return htmlContent;
    } catch (error) {
      console.error("Error during conversion:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="h-[100%] relative">
        <div className="w-[100%] h-[10%] flex justify-between items-center bg-[#F9FAFB] border-b">
          <div className="flex w-[50%] justify-start items-center gap-2 ml-4 sm:w-[30%]">
            <div>
              <Link to="/user/storage">
                <FileTextTwoTone className="text-[30px] sm:text-[50px]" />
              </Link>
            </div>
            <div className="flex flex-col">
              <Label className="text-[20px]">Title:</Label>
              <Input
                className="h-8"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={documentId}
              />
            </div>
          </div>
          <div className="mr-4 flex gap-2">
            <Button
              className="bg-blue-500 hover:bg-blue-600 rounded-xl"
              onClick={checkUpdate ? handleUpdate : handleSave}
              disabled={disabled}
            >
              Save
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 rounded-xl"
              onClick={handleNewDocument}
            >
              New Document
            </Button>
            <Button
              className="bg-gray-200 hover:bg-gray-300 rounded-xl lg:hidden"
              onClick={handleShowMenuMobile}
            >
              {isOpenMenu ? (
                <MenuUnfoldOutlined
                  className="!text-black text-[20px]"
                  rotate={90}
                />
              ) : (
                <MenuOutlined className="!text-black text-[20px]" />
              )}
            </Button>
            {isOpenMenu && (
              <div className="absolute top-[75px] right-[15px] z-20 md:top-[70px]">
                <MenuMobile />
              </div>
            )}
          </div>
        </div>

        <div className="h-[90%]">
          <Editor
            apiKey="je3ii0vwhrfin6fb0wvao2mp6d2tnthtnfkw5q66ejuz1mpx"
            value={editorContent}
            onEditorChange={handleEditorChange}
            disabled = {disabled}
            init={{
              height: "100%",
              resize: false,
              menu: {
                file: {
                  title: "File",
                  items:
                    "newdocument restoredraft | preview | print | openfile",
                },
                edit: {
                  title: "Edit",
                  items:
                    "undo redo | cut copy paste pastetext | selectall | searchreplace",
                },
                view: {
                  title: "View",
                  items:
                    "code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments",
                },
                insert: {
                  title: "Insert",
                  items:
                    "link media image | import |template hr | pagebreak charmap emoticons | insertdatetime",
                },
                format: {
                  title: "Format",
                  items:
                    "bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align | forecolor backcolor | removeformat",
                },
                tools: {
                  title: "Tools",
                  items: "spellchecker spellcheckerlanguage | code wordcount",
                },
                table: {
                  title: "Table",
                  items: "inserttable tableprops deletetable | cell row column",
                },
                help: {
                  title: "Help",
                  items: "help",
                },
                custom: {
                  title: "Save",
                  items: "save",
                },
              },
              menubar: "file edit view insert format tools table help custom",
              plugins: [
                "advlist",
                "autolink",
                "link",
                "image",
                "lists",
                "charmap",
                "preview",
                "anchor",
                "pagebreak",
                "searchreplace",
                "wordcount",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "emoticons",
                "autosave",
                "save",
                "help",
                "export",
                "powerpaste",
                "autocorrect",
                "tinymcespellchecker",
                "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
              ],
              toolbar:
                "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl | export",
              spellchecker_language: "en_US",
              setup: (editor) => {
                editor.ui.registry.addMenuItem("save", {
                  text: "Save",
                  onAction: handleSave,
                });
                editor.ui.registry.addMenuItem("openfile", {
                  text: "Open File",
                  onAction: () =>
                    document.getElementById("file-input")?.click(),
                });
                editor.ui.registry.addMenuItem("Import", {
                  text: "Import",
                  onAction: handleImport,
                });
              },
              pagebreak_separator: "<!-- my page break -->",
              pagebreak_split_block: true,
              automatic_uploads: true,
              autosave_restore_when_empty: true,
              autosave_ask_before_unload: true,
              save_onsavecallback: () => {
                message.success("Save Success!");
              },
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              toolbar_mode: "sliding",
              file_picker_types: "file image media",
              file_picker_callback: (cb, meta: any) => {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                if (meta.filetype === "image") {
                  input.setAttribute("accept", "image/*");
                } else if (meta.filetype === "media") {
                  input.setAttribute("accept", "video/*, audio/*");
                } else {
                  input.setAttribute("accept", "*");
                }

                input.onchange = function (e) {
                  const target = e.target as HTMLInputElement;
                  const file = target.files?.[0];

                  if (file) {
                    const reader = new FileReader();
                    reader.onload = function () {
                      const base64 = reader.result?.toString().split(",")[1];
                      const id = "blobid" + new Date().getTime();
                      const blobCache =
                        window.tinymce?.activeEditor?.editorUpload.blobCache;
                      const blobInfo = blobCache?.create(id, file, base64);

                      if (blobInfo) {
                        blobCache.add(blobInfo);
                        cb(blobInfo.blobUri(), { title: file.name });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                };

                input.click();
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TinyMCEComponent;
