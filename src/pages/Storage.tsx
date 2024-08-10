import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import SpinPage from "@/components/Loader/SpinPage";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileTextTwoTone,
  ShareAltOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Tooltip,
} from "antd";
import useFetchData from "@/service/component/getData";
import { useNavigate } from "react-router-dom";
import apiService from "@/service/apiService";
import SpinButton from "@/components/Loader/SpinButton";
import Header from "./components/Header";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import JSZip from "jszip";

const Storage = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalChangeTitle, setOpenModalChangeTitle] = useState(false);
  const [openModalShare, setOpenModalShare] = useState(false);
  const [idDocument, setIdDocument] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newUser, setNewUser] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [createdAtRange, setCreatedAtRange] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | null>(null);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { Search } = Input;
  const { data: documentList, refetch } = useFetchData("/user/get-documents");

  //SET LOADING STATE
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // HANDLE CREATED AT RANGE
  const handleCreatedAtRange = (dateStrings: any) => {
    setCreatedAtRange(dateStrings);
  };

  //HANDLE FORMAT DAY
  const formatCreatedAt = (createdAt: any) => {
    const date = new Date(createdAt);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  //HANLDE NAVIGATION
  const handleEditorChange = (docId: any) => {
    navigation(`/home?docId=${docId}`);
  };

  //SHOW AND CANCEL MODAL DELETE DOCUMENT
  const showModalDelete = (id: any) => {
    setIdDocument(id);
    setOpenModalDelete(true);
  };

  const handleCancelModalDelete = () => {
    setOpenModalDelete(false);
  };
  //END SHOW AND CANCEL MODAL DELETE DOCUMENT

  //SHOW AND CANCEL MODAL CHANGE DOCUMENT TITLE
  const handleShowModalChangeTitle = (id: any) => {
    setIdDocument(id);
    setOpenModalChangeTitle(true);
  };

  const handleCancelModalChangeTitle = () => {
    setOpenModalChangeTitle(false);
    setNewTitle("");
    form.resetFields();
  };
  //END SHOW AND CANCEL MODAL CHANGE DOCUMENT TITLE

  //SHOW AND CANCEL MODAL SHARE DOCUMENT
  const handleShowModalShareDocument = (id: any) => {
    setIdDocument(id);
    setOpenModalShare(true);
  };

  const handleCancelModalShareDocument = () => {
    setOpenModalShare(false);
    setNewUser("");
  };
  //END SHOW AND CANCEL MODAL SHARE DOCUMENT

  const handleInputTitleChange = async (e: any) => {
    setNewTitle(e.target.value);
    form.setFieldsValue({ newTitle: e.target.value });
  };

  const handleInputShareDocument = async (e: any) => {
    setNewUser(e.target.value);
    form.setFieldsValue({ email: e.target.value });
  };

  //HANDLE DELETE DOCUMENT
  const handleDeleteDocument = async (id: any) => {
    setIsDisabled(true);
    try {
      await apiService.delete(`/user/documents/${id}`);
      message.success("Document deleted successfully!");
      setOpenModalDelete(false);
      setNewTitle("");
      refetch();
      setTimeout(() => setIsDisabled(false), 2000);
    } catch (e) {
      setTimeout(() => setIsDisabled(false), 2000);
    }
  };

  //HANDLE RENAME TITLE DOCUMENT
  const handleRenameTitle = async () => {
    setIsDisabled(true);
    try {
      await form.validateFields();
      await apiService.post("/user/documents/update-title", {
        documentId: idDocument,
        newTitle: newTitle,
      });
      message.success("Title updated successfully!");
      refetch();
      setNewTitle("");
      form.resetFields();
      setOpenModalChangeTitle(false);
      setTimeout(() => setIsDisabled(false), 2000);
    } catch (e) {
      setTimeout(() => setIsDisabled(false), 2000);
    }
  };

  //HANDLE SHARE DOCUMENT
  const handleShareDocument = async () => {
    setIsDisabled(true);
    try {
      await form.validateFields();
      await apiService.post("/user/documents-share", {
        documentId: idDocument,
        email: newUser,
      });
      message.success("Document shared successfully!");
      refetch();
      setNewUser("");
      form.resetFields();
      setOpenModalShare(false);
      setTimeout(() => setIsDisabled(false), 2000);
    } catch (error) {
      setTimeout(() => setIsDisabled(false), 2000);
    }
  };

  const handleDownloadDocument = async (doc: any) => {
    try {
      const content = doc?.content;
      if (!content) {
        message.error("No content available to download!");
        return;
      }
      const decodedContent = atob(content);
      console.log(decodedContent);
      const zip = new JSZip();
      zip.file("document.docx", decodedContent, { binary: true });

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "document.docx");
      message.success("Document downloaded successfully!");
    } catch (err) {
      console.log(err);
      message.error("Failed to download document.");
    }
  };

  const sortMenu = (
    <Menu
      onClick={(e) => setSortOrder(e.key as "newest" | "oldest")}
      items={[
        { key: "newest", label: "Latest Date" },
        { key: "oldest", label: "Oldest Date" },
      ]}
    />
  );
  return (
    <>
      <div className="w-[100%] h-dvh flex justify-between">
        {/* SIDE BAR */}
        <div className="min-w-[20%] h-[100%] hidden lg:block">
          <SideBar />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="w-full h-vh flex items-center justify-center">
            <SpinPage />
          </div>
        ) : (
          <div className="min-w-[100%] h-dvh  flex flex-col items-center gap-5 overflow-auto lg:min-w-[80%] ">
            {/* HEADER */}
            <div className="w-[90%]">
              <Header title="Storage" />
            </div>

            {/* FILTER */}
            <div className="w-[90%] flex flex-col items-start gap-3 mt-2 sm:flex-row sm:items-center">
              <Search
                placeholder="Search Title"
                allowClear
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-[50%] sm:w-[20%]"
              />
              <RangePicker
                onChange={handleCreatedAtRange}
                placeholder={["Start date", "End date"]}
                className="w-[50%] sm:w-[20%]"
              />
              <Dropdown
                overlay={sortMenu}
                trigger={["click"]}
                className="w-[30%] sm:w-[20%]"
              >
                <Button>
                  Sort By <DownOutlined />
                </Button>
              </Dropdown>
            </div>

            {/*STORAGE DOCUMENT */}
            {Object.values(documentList)
              ?.filter(
                (doc: any) =>
                  doc._id &&
                  doc.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
                  (!createdAtRange ||
                    ((!createdAtRange[0] ||
                      new Date(doc.createdAt).setHours(0, 0, 0, 0) >=
                        new Date(createdAtRange[0]).setHours(0, 0, 0, 0)) &&
                      (!createdAtRange[1] ||
                        new Date(doc.createdAt).setHours(0, 0, 0, 0) <=
                          new Date(createdAtRange[1]).setHours(
                            23,
                            59,
                            59,
                            999
                          ))))
              )
              .sort((a: any, b: any) => {
                if (sortOrder === "newest") {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                } else if (sortOrder === "oldest") {
                  return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                  );
                }
                return 0;
              })
              .map((doc: any) => (
                <div
                  key={doc?._id}
                  className="w-[90%] mt-2 border-b-2 border-t-2 flex justify-center items-center gap-2 md:h-[16%]"
                >
                  <div className="w-[20%] flex justify-center border-r-2">
                    <FileTextTwoTone className="text-[30px] sm:text-[60px]" />
                  </div>
                  <div className="w-[80%] flex flex-col p-2 gap-2">
                    <div className=" flex justify-between items-center font-semibold w-[100%] ">
                      <button
                        className="max-w-[50%] text-[20px] hover:underline sm:text-[25px] truncate sm:max-w-[70%]"
                        onClick={() => handleEditorChange(doc._id)}
                      >
                        {doc?.title}
                      </button>
                      <div className="max-w-[50%] flex gap-2 sm:max-w-[30%]">
                        <Tooltip title="Edit">
                          <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            disabled={isDisabled}
                            onClick={() => handleShowModalChangeTitle(doc?._id)}
                          />
                        </Tooltip>
                        <Tooltip title="Download">
                          <Button
                            shape="circle"
                            onClick={() => handleDownloadDocument(doc)}
                            icon={<VerticalAlignBottomOutlined />}
                            disabled={isDisabled}
                          />
                        </Tooltip>
                        <Tooltip title="Share">
                          <Button
                            shape="circle"
                            icon={<ShareAltOutlined />}
                            disabled={isDisabled}
                            onClick={() =>
                              handleShowModalShareDocument(doc?._id)
                            }
                          />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => showModalDelete(doc?._id)}
                            disabled={isDisabled}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex text-[15px] w-full gap-5 md:gap-0">
                      <span className="md:w-[30%]">
                        Create: {formatCreatedAt(doc?.createdAt)}
                      </span>
                      <span className="md:w-[30%]">
                        Last update: {formatCreatedAt(doc?.updatedAt)}
                      </span>
                    </div>
                    <div className="text-[15px]">
                      <span>Owner: {doc?.owner}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* MODAL DELETE DOCUMENT */}
        <Modal
          open={openModalDelete}
          title="Are you sure you want to delete files?"
          onCancel={handleCancelModalDelete}
          footer={[
            <button
              className="bg-white text-black border-2 w-[70px] !mr-[10px] rounded h-[30px] hover:scale-[1.1]"
              onClick={handleCancelModalDelete}
              disabled={isDisabled}
            >
              Return
            </button>,
            <button
              className="bg-red-500 text-white w-[70px] rounded h-[30px] hover:scale-[1.1]"
              onClick={() => handleDeleteDocument(idDocument)}
              disabled={isDisabled}
            >
              {isDisabled ? <SpinButton /> : <span>Delete</span>}
            </button>,
          ]}
        ></Modal>

        {/* MODAL CHANGE DOCUMENT TITLE */}
        <Modal
          title="Rename Title"
          open={openModalChangeTitle}
          onCancel={handleCancelModalChangeTitle}
          footer={[
            <button
              className="bg-blue-500 text-white w-[70px] rounded h-[30px]"
              disabled={isDisabled}
              onClick={handleRenameTitle}
            >
              {isDisabled ? <SpinButton /> : "Rename"}
            </button>,
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleRenameTitle}
          >
            <Form.Item
              label={
                <span className="text-[14px]">
                  Title <span className="text-red-500">*</span>
                </span>
              }
              name="newTitle"
              rules={[
                { required: true, message: "Please input your Title!" },
                {
                  min: 1,
                  message: "Title must be at least 1 characters long!",
                },
                {
                  max: 30,
                  message: "Title must be at most 30 characters long!",
                },
                {
                  pattern: /^[a-zA-Z0-9-_]+$/,
                  message:
                    "Title can only contain letters, numbers, hyphens (-) and underscores (_)",
                },
              ]}
            >
              <Input
                placeholder="example-title"
                className="h-[36px]"
                onChange={handleInputTitleChange}
                value={newTitle}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* MODAL SHARE DOCUMENT */}
        <Modal
          title="Share Documents"
          open={openModalShare}
          onCancel={handleCancelModalShareDocument}
          footer={[
            <button
              className="bg-blue-500 text-white w-[70px] rounded h-[30px]"
              disabled={isDisabled}
              onClick={handleShareDocument}
            >
              {isDisabled ? <SpinButton /> : "Share"}
            </button>,
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleShareDocument}
          >
            <Form.Item
              label={
                <span className="text-[14px]">
                  Email <span className="text-red-500">*</span>
                </span>
              }
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input
                placeholder="email-user"
                className="h-[36px]"
                onChange={handleInputShareDocument}
                value={newUser}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Storage;
