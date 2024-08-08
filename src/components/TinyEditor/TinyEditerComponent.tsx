import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { message } from "antd";
import "./Tiny.css";
import { Base64 } from "js-base64";
import apiService from "@/service/apiService";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import useFetchData from "@/service/component/getData";
import { MenuOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import MenuMobile from "@/pages/components/MenuMobile";

const TinyMCEComponent = ({ documentId }: { documentId: any }) => {
  const [editorContent, setEditorContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const editorContentRef = useRef<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [checkUpdate, setCheckUpdate] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { data: documentData } = useFetchData(
    documentId ? `/user/infor-document/${documentId}` : null
  );

  useEffect(() => {
    if (documentData) {
      loadContent();
      setCheckUpdate(true);
    }
  }, [documentData]);

  const handleShowMenuMobile = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    editorContentRef.current = content;
  };

  const loadContent = () => {
    const base64Content = documentData?.document?.content;
    const htmlContent = Base64.decode(base64Content);
    setEditorContent(htmlContent);
    setTitle(documentData?.document?.title);
  };

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

  const handleUpdate = async () => {
    setDisabled(true);
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
      message.success("Document update successfully!");
      setTimeout(() => setDisabled(false), 2000);
    } catch (error) {
      setTimeout(() => setDisabled(false), 2000);
    }
  };

  return (
    <>
      <div className="h-[100%] relative">
        <div className="w-[100%] h-[10%] flex justify-between items-center bg-[#F9FAFB] border-b">
          <div className="flex w-[30%] justify-center items-center gap-2 ml-4">
            <Label className="text-[20px]">Title:</Label>
            <Input
              className="h-8"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mr-4 flex gap-2">
            <Button
              className="bg-blue-500 hover:bg-blue-600 rounded-xl"
              onClick={checkUpdate ? handleUpdate : handleSave}
              disabled={disabled}
            >
              Save
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl">
              Share
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
                <MenuMobile/>
              </div>
            )}
          </div>
        </div>

        <div className="h-[90%]">
          <Editor
            apiKey="8kpopll9pa8gpus8k7ikasqwm8wuktiabaxzl0fzh6txmk6x"
            value={editorContent}
            onEditorChange={handleEditorChange}
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
                    "link media | template hr | pagebreak charmap emoticons | insertdatetime",
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
                "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
              ],
              toolbar:
                "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl ",
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
              },
              autosave_restore_when_empty: true,
              autosave_ask_before_unload: false,
              save_onsavecallback: () => {
                message.success("Save Success!");
              },
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              toolbar_mode: "sliding",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TinyMCEComponent;
