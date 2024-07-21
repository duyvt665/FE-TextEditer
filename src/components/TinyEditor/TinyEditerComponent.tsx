import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { message } from "antd";
import mammoth from "mammoth";
import "./Tiny.css";

const TinyMCEComponent: React.FC = () => {
  const [editorContent, setEditorContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSave = () => {
    message.success("success");
  };

  const handleFileOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result;
        if (result && typeof result !== "string") {
          // Check if result is ArrayBuffer
          try {
            const arrayBuffer = result as ArrayBuffer;
            const { value } = await mammoth.convertToHtml({ arrayBuffer });
            setEditorContent(value);
          } catch (error) {
            message.error("Failed to open the DOCX file.");
          }
        } else {
          message.error("File format not supported.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <div className="h-[100%] relative">
        <input
          type="file"
          accept=".docx,.txt"
          style={{ display: "none" }}
          id="file-input"
          onChange={handleFileOpen}
        />
        <Editor
          apiKey="x1rvv92yzgd93xjv5aodyag1yioug44uwqzbnjs6ktcw5bxv"
          value={editorContent}
          onEditorChange={handleEditorChange}
          init={{
            height: "100%",
            resize: false,
            menu: {
              file: {
                title: "File",
                items: "newdocument restoredraft | preview | print | openfile",
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
              "export",
              "autosave",
              "save",
              "help",
              "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
            ],
            toolbar:
              "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl export",
            setup: (editor) => {
              // editor.ui.registry.addMenuItem("save", {
              //   text: "Save",
              //   onAction: handleSave,

              // });
              editor.ui.registry.addMenuItem("openfile", {
                text: "Open File",
                onAction: () => document.getElementById("file-input")?.click(),
              });
            },
            autosave_restore_when_empty: true,
            autosave_ask_before_unload: false,
            // save_onsavecallback: () => {
            //   message.success("Save Success!")
            // },
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            toolbar_mode: "sliding",
          }}
        />
      </div>
    </>
  );
};

export default TinyMCEComponent;
