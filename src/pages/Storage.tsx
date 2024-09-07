import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import SpinPage from "@/components/Loader/SpinPage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AppstoreOutlined,
  BarsOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  FileAddOutlined,
  FileTextOutlined,
  FileTextTwoTone,
  FolderAddOutlined,
  FolderOpenTwoTone,
  FolderOutlined,
  PlusCircleOutlined,
  ShareAltOutlined,
  UserOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Pagination,
  Segmented,
  Select,
  Tooltip,
} from "antd";
import useFetchData from "@/service/component/getData";
import { useNavigate } from "react-router-dom";
import apiService from "@/service/apiService";
import SpinButton from "@/components/Loader/SpinButton";
import Header from "./components/Header";
import React from "react";
import { Base64 } from "js-base64";

const Storage = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalChangeTitle, setOpenModalChangeTitle] = useState(false);
  const [openModalShare, setOpenModalShare] = useState(false);
  const [openModalAddFolder, setOpenModalAddFolder] = useState(false);
  const [openModalDeleteFolder, setOpenModalDeleteFolder] = useState(false);
  const [openModalChangeNameFolder, setOpenModalChangeNameFolder] =
    useState(false);
  const [openModalAddFileToFolder, setOpenModalAddFileToFolder] =
    useState(false);
  const [openModalShowFileFolder, setOpenModalShowFileFolder] = useState(false);
  const [openModalRemoveDocumentFolder, setOpenModalRemoveDocumentFolder] =useState(false);
  const [idDocument, setIdDocument] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledSave, setIsDisabledSave] = useState(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newUser, setNewUser] = useState("");
  const [newFolder, setNewFolder] = useState<string>("");
  const [newNameFolder, setNewNameFolder] = useState("");
  const [folderId, setFolderId] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [createdAtRange, setCreatedAtRange] = useState<any>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | null>(null);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { Search } = Input;
  const { Option } = Select;
  const [currentPage, setCurrentPage] = useState(1);
  const [permission, setPermission] = useState("view");
  const [permissionsUser, setPermissionsUser] = useState("view");
  const [emailUser, setEmailUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userOwners, setUserOwners] = useState<
    { email: string; permission: string }[]
  >([]);
  const [responseData, setResponseData] = useState<any>(null);
  const [viewMode, setViewMode] = useState("List");
  const [viewType, setViewType] = useState("File");
  const pageSize = viewMode === "List" ? 4 : 6;

  const { data: documentList, refetch } = useFetchData("/user/get-documents");
  const { data: folderList, refetch: folderRefetch } =
    useFetchData("/folder/get-all");
  const { data: userData } = useFetchData("/user/get-info");

  const dataList = viewType === "File" ? documentList : folderList;

  const fileList = responseData
    ? Object.values(responseData).filter((item: any) => item._id)
    : [];

  const documentArray = documentList
    ? Object.values(documentList).filter((item: any) => item._id)
    : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const paginatedDocuments = React.useMemo(() => {
    if (!dataList) return [];

    return Object.values(dataList)
      .filter(
        (doc: any) =>
          doc._id &&
          doc.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
          (!createdAtRange ||
            ((!createdAtRange[0] ||
              new Date(doc.createdAt).setHours(0, 0, 0, 0) >=
                new Date(createdAtRange[0]).setHours(0, 0, 0, 0)) &&
              (!createdAtRange[1] ||
                new Date(doc.createdAt).setHours(0, 0, 0, 0) <=
                  new Date(createdAtRange[1]).setHours(23, 59, 59, 999))))
      )
      .sort((a: any, b: any) => {
        if (sortOrder === "newest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortOrder === "oldest") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return 0;
      });
  }, [dataList, searchTitle, createdAtRange, sortOrder]);

  const currentDocuments = paginatedDocuments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
  const handleEditorChange = (docId: any, permission: string = "edit") => {
    navigation(`/home?docId=${docId}&permission=${permission}`);
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

  //SHOW AND CANCEL MODAL DELETE FOLDER
  const showModalDeleteFolder = (id: any) => {
    setIdDocument(id);
    setOpenModalDeleteFolder(true);
  };

  const handleCancelModalDeleteFolder = () => {
    setOpenModalDeleteFolder(false);
  };
  //END SHOW AND CANCEL MODAL DELETE FOLDER

  //SHOW AND CANCEL MODAL RENAME TO FOLDER
  const handleShowModalChangeNameFolder = (id: any) => {
    setIdDocument(id);
    setOpenModalChangeNameFolder(true);
  };

  const handleCancelModalChangeNameFolder = () => {
    setOpenModalChangeNameFolder(false);
    setNewNameFolder("");
    form.resetFields();
  };
  //END SHOW AND CANCEL MODAL RENAME TO FOLDER

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
  const handleShowModalShareDocument = async (id: any) => {
    setIdDocument(id);
    setOpenModalShare(true);

    try {
      const response = await apiService.post("/user/user-owners", {
        documentId: id,
      });
      if (response.statusCode === 200 && response.status === "success") {
        const ownersArray = Object.keys(response)
          .filter((key) => key !== "status" && key !== "statusCode")
          .map((key) => response[key]);
        setUserOwners(ownersArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelModalShareDocument = () => {
    setOpenModalShare(false);
    setNewUser("");
  };
  //END SHOW AND CANCEL MODAL SHARE DOCUMENT

  //SHOW AND CANCEL MODAL ADD FOLDER
  const handleShowModalAddFolder = () => {
    setOpenModalAddFolder(true);
  };

  const handleCancelModalAddFolder = () => {
    setOpenModalAddFolder(false);
    setNewFolder("");
  };
  //END SHOW AND CANCEL MODAL ADD FOLDER

  //SHOW AND CANCEL MODAL ADD FILE TO FOLDER
  const handleShowModalAddFileFolder = (folderId: any) => {
    setOpenModalAddFileToFolder(true);
    setFolderId(folderId);
  };

  const handleCancelModalAddFiletoFolder = () => {
    setOpenModalAddFileToFolder(false);
  };
  //END SHOW AND CANCEL MODAL ADD FILE TO FOLDER

  const handleShowModalShowFileInFolder = async (folderId: any) => {
    setOpenModalShowFileFolder(true);
    setFolderId(folderId);
    try {
      const response = await apiService.post("/folder/get-document", {
        folderId: folderId,
      });
      setResponseData(response);
    } catch (error) {}
  };

  const handleCancelModalShowFileInFolder = () => {
    setOpenModalShowFileFolder(false);
  };

  const handleShowModalRemoveDocumentFolder = (documentId: any) => {
    setOpenModalRemoveDocumentFolder(true);
    setIdDocument(documentId);
  }

  const handleCancelModalRemoveDocumentFolder = () => {
    setOpenModalRemoveDocumentFolder(false)
  }

  const handleInputTitleChange = async (e: any) => {
    setNewTitle(e.target.value);
    form.setFieldsValue({ newTitle: e.target.value });
  };

  const handleInputShareDocument = async (e: any) => {
    setNewUser(e.target.value);
    form.setFieldsValue({ email: e.target.value });
  };

  const handleInputAddModal = async (e: any) => {
    setNewFolder(e.target.value);
    form.setFieldsValue({ newFolder: e.target.value });
  };

  const handleInputChangeNameFolder = async (e: any) => {
    setNewNameFolder(e.target.value);
    form.setFieldsValue({ newNameFolder: e.target.value });
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
        permission: permission,
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

  //HANDLE DOWNLOAD DOCUMENT
  const handleDownloadDocument = async (content: any, filename: string) => {
    let htmlContent = Base64.decode(content);
    const preHtml =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";

    const postHtml = "</body></html>";
    const fullHtml = preHtml + htmlContent + postHtml;

    const blob = new Blob(["\ufeff", fullHtml], {
      type: "application/msword",
    });

    const url =
      "data:application/vnd.ms-word;charset=utf-8," +
      encodeURIComponent(fullHtml);

    filename = filename.endsWith(".doc") ? filename : `${filename}.doc`;

    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    if ((navigator as any).msSaveOrOpenBlob) {
      (navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.click();
    }

    document.body.removeChild(downloadLink);
  };

  const handleSelectChange = (value: any, owner: any) => {
    setPermissionsUser(value);
    setEmailUser(owner);
  };

  //HANDLE PERMISSION CHANGE
  const handlePermissionChange = async () => {
    setIsDisabledSave(true);
    try {
      await apiService.post("/user/update-permissions", {
        documentId: idDocument,
        email: emailUser,
        permission: permissionsUser,
      });
      message.success("Permissions updated successfully!");
      handleCancelModalShareDocument();
      setTimeout(() => setIsDisabledSave(false), 2000);
    } catch (error) {
      setTimeout(() => setIsDisabledSave(false), 2000);
    }
  };

  //HANDLE ADD FOLDER
  const handleAddFolder = async () => {
    setIsDisabled(true);
    try {
      await form.validateFields();
      await apiService.post("/add-folder", { title: newFolder });
      message.success("Add Folder Success!");
      folderRefetch();
      form.resetFields();
      handleCancelModalAddFolder();
      setTimeout(() => setIsDisabled(false), 2000);
    } catch (error) {
      setTimeout(() => setIsDisabled(false), 2000);
    }
  };

  //HANDLE DELETE FOLDER
  const handleDeleteFolder = async (id: any) => {
    setIsDisabled(true);
    try {
      await apiService.delete(`/folder/remove/${id}`);
      message.success("Folder deleted successfully!");
      folderRefetch();
      handleCancelModalDeleteFolder();
      setTimeout(() => setIsDisabled(false), 2000);
    } catch (error) {
      setTimeout(() => setIsDisabled(false), 2000);
    }
  };

  //HANDLE CHANGE NAME FOLDER
  const handleChangeNameFolder = async () => {
    setIsDisabled(true);
    try {
      await form.validateFields();
      await apiService.post("/folder/rename", {
        folderId: idDocument,
        newName: newNameFolder,
      });
      message.success("Change name folder successfully!");
      folderRefetch();
      handleCancelModalChangeNameFolder();
      setTimeout(() => setIsDisabled(false), 2000);
    } catch (error) {
      setTimeout(() => setIsDisabled(false), 2000);
    }
  };

  //HANDLE ADD FILE
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".docx";
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setIsLoading(true);
        try {
          const htmlString = await convertDocxToHtml(file);
          const base64Html = btoa(htmlString);
          const fileName = file.name.replace(/\.docx$/, "");
          await addDocument(fileName, base64Html);
        } catch (error) {
          console.error("Error processing file:", error);
        } finally {
          setIsLoading(false);
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
      let htmlContent = atob(base64Html);

      return htmlContent;
    } catch (error) {
      console.error("Error during conversion:", error);
      throw error;
    }
  };

  const addDocument = async (title: string, content: string) => {
    try {
      await apiService.post("/user/add-document", {
        title: title,
        content: content,
      });
      message.success("Document added successfully!");
      refetch();
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
    }
  };
  //END HANDLE ADD FILE

  //HANDLE ADD FILE TO FOLDER
  const handleAddFileFolder = async () => {
    setIsDisabled(true);
    try {
      await apiService.post("/folder/add-document", {
        documentId: idDocument,
        folderId: folderId,
      });
      message.success("Document added to folder successfully");
      setTimeout(() => setIsDisabled(false), 2000);
      handleCancelModalAddFiletoFolder();
    } catch (error) {
      setTimeout(() => setIsDisabled(false), 2000);
    }
  };

  //HANDLE REMOVE DOCUMENT FROM FOLDER
  const handleRemoveDocumentFolder = async () => {
    setIsDisabled(true);
    try{
      await apiService.post("/folder/remove-document",{ documentId: idDocument, folderId: folderId})
      message.success("Document deleted from folder successfully");
      handleCancelModalShowFileInFolder();
      handleCancelModalRemoveDocumentFolder();
      setTimeout(() => setIsDisabled(false), 2000);
    } catch (error) {
      setTimeout(() => setIsDisabled(false), 2000);
    }
  }

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
      <div className="w-[100%] h-dvh flex justify-between relative">
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
            <div className="w-[90%] flex flex-col items-start justify-between gap-3 mt-2 sm:flex-row sm:items-center">
              <div className="w-[100%] flex flex-col gap-3 sm:flex-row">
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
              <div className="flex gap-2">
                <Tooltip title="Add File">
                  <button
                    className="bg-gray-100 px-4 rounded-md hover:bg-gray-200"
                    onClick={handleImport}
                  >
                    <FileAddOutlined />
                  </button>
                </Tooltip>
                <Tooltip title="Add Folder">
                  <button
                    className="bg-gray-100 px-4 rounded-md hover:bg-gray-200"
                    onClick={handleShowModalAddFolder}
                  >
                    <FolderAddOutlined />
                  </button>
                </Tooltip>
                <Segmented
                  options={[
                    {
                      label: "File",
                      value: "File",
                      icon: <FileTextOutlined />,
                    },
                    {
                      label: "Folder",
                      value: "Folder",
                      icon: <FolderOutlined />,
                    },
                  ]}
                  value={viewType}
                  onChange={setViewType}
                />
                <Segmented
                  options={[
                    { label: "List", value: "List", icon: <BarsOutlined /> },
                    {
                      label: "Grid",
                      value: "Grid",
                      icon: <AppstoreOutlined />,
                    },
                  ]}
                  value={viewMode}
                  onChange={setViewMode}
                />
              </div>
            </div>

            {/*STORAGE DOCUMENT */}
            {viewMode === "List" && viewType === "File" ? (
              currentDocuments.map((doc: any) => {
                const userPermissions =
                  doc.permissions?.[userData?.userInfo?._id];
                const canEdit = userPermissions === "edit";

                return (
                  <div
                    key={doc?._id}
                    className="w-[90%] mt-2 border-b-2 border-t-2 flex justify-center items-center gap-2 md:h-[16%]"
                  >
                    <div className="w-[20%] flex justify-center border-r-2">
                      <FileTextTwoTone className="text-[30px] sm:text-[60px]" />
                    </div>
                    <div className="w-[80%] flex flex-col p-2 gap-2">
                      <div className="flex justify-between items-center font-semibold w-[100%]">
                        <button
                          className="max-w-[50%] text-[20px] hover:underline sm:text-[25px] truncate sm:max-w-[70%]"
                          onClick={() =>
                            handleEditorChange(doc._id, userPermissions)
                          }
                        >
                          {doc?.title}
                        </button>
                        <div className="max-w-[50%] flex gap-2 sm:max-w-[30%]">
                          <Tooltip title="Edit Title">
                            <Button
                              shape="circle"
                              icon={<EditOutlined />}
                              disabled={
                                isDisabled ||
                                (!canEdit &&
                                  doc?.owner !== userData?.userInfo?.email)
                              }
                              onClick={() =>
                                handleShowModalChangeTitle(doc?._id)
                              }
                            />
                          </Tooltip>
                          <Tooltip title="Download">
                            <Button
                              shape="circle"
                              icon={<VerticalAlignBottomOutlined />}
                              onClick={() =>
                                handleDownloadDocument(doc?.content, doc?.title)
                              }
                              disabled={isDisabled}
                            />
                          </Tooltip>
                          <Tooltip title="Share">
                            <Button
                              shape="circle"
                              icon={<ShareAltOutlined />}
                              disabled={
                                isDisabled ||
                                (!canEdit &&
                                  doc?.owner !== userData?.userInfo?.email)
                              }
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
                );
              })
            ) : viewMode === "List" && viewType === "Folder" ? (
              currentDocuments.map((folder: any) => {
                return (
                  <div
                    key={folder?._id}
                    className="w-[90%] mt-2 border-b-2 border-t-2 flex justify-center items-center gap-2 md:h-[16%]"
                  >
                    <div className="w-[20%] flex justify-center border-r-2">
                      <FolderOpenTwoTone className="text-[30px] sm:text-[60px]" />
                    </div>
                    <div className="w-[80%] flex flex-col p-2 gap-2">
                      <div className="flex justify-between items-center font-semibold w-[100%]">
                        <button
                          className="max-w-[50%] text-[20px] hover:underline sm:text-[25px] truncate sm:max-w-[70%]"
                          onClick={() =>
                            handleShowModalShowFileInFolder(folder?._id)
                          }
                        >
                          {folder?.title}
                        </button>
                        <div className="max-w-[50%] flex gap-2 sm:max-w-[30%]">
                          <Tooltip title="Edit Title">
                            <Button
                              shape="circle"
                              icon={<EditOutlined />}
                              disabled={isDisabled}
                              onClick={() =>
                                handleShowModalChangeNameFolder(folder?._id)
                              }
                            />
                          </Tooltip>
                          <Tooltip title="Add File">
                            <Button
                              shape="circle"
                              icon={<PlusCircleOutlined />}
                              onClick={() =>
                                handleShowModalAddFileFolder(folder?._id)
                              }
                              disabled={isDisabled}
                            />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              shape="circle"
                              icon={<DeleteOutlined />}
                              disabled={isDisabled}
                              onClick={() => showModalDeleteFolder(folder?._id)}
                            />
                          </Tooltip>
                        </div>
                      </div>
                      <div className="flex text-[15px] w-full gap-5 md:gap-0">
                        <span className="md:w-[30%]">
                          Create: {formatCreatedAt(folder?.createdAt)}
                        </span>
                        <span className="md:w-[30%]">
                          Last update: {formatCreatedAt(folder?.updatedAt)}
                        </span>
                      </div>
                      <div className="text-[15px]">
                        <span>Owner: {folder?.owner}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : viewMode === "Grid" && viewType === "File" ? (
              <div className="w-[90%] flex flex-wrap justify-start">
                {currentDocuments.map((doc: any) => {
                  const userPermissions =
                    doc.permissions?.[userData?.userInfo?._id];
                  const canEdit = userPermissions === "edit";
                  return (
                    <div
                      key={doc?._id}
                      className="w-[30%] flex flex-col bg-[#F0F4F9] mb-4 p-4 rounded-xl gap-2 mr-9"
                    >
                      <div className="flex w-full justify-between">
                        <FileTextTwoTone className="text-[20px]" />
                        <button onClick={() => handleEditorChange(doc._id)}>
                          {doc?.title}
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="hover:bg-gray-200 w-10">
                            <EllipsisOutlined />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <div className="flex items-center gap-4">
                              <Tooltip placement="topRight" title="Edit Title">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleShowModalChangeTitle(doc?._id)
                                  }
                                  disabled={
                                    isDisabled ||
                                    (!canEdit &&
                                      doc?.owner !== userData?.userInfo?.email)
                                  }
                                >
                                  <EditOutlined />
                                </DropdownMenuItem>
                              </Tooltip>
                              <Tooltip placement="topRight" title="Downdload">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDownloadDocument(
                                      doc?.content,
                                      doc?.title
                                    )
                                  }
                                  disabled={isDisabled}
                                >
                                  <VerticalAlignBottomOutlined />
                                </DropdownMenuItem>
                              </Tooltip>
                              <Tooltip placement="topRight" title="Share">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleShowModalShareDocument(doc?._id)
                                  }
                                  disabled={
                                    isDisabled ||
                                    (!canEdit &&
                                      doc?.owner !== userData?.userInfo?.email)
                                  }
                                >
                                  <ShareAltOutlined />
                                </DropdownMenuItem>
                              </Tooltip>
                              <Tooltip placement="topRight" title="Delete">
                                <DropdownMenuItem
                                  onClick={() => showModalDelete(doc?._id)}
                                  disabled={isDisabled}
                                >
                                  <DeleteOutlined />
                                </DropdownMenuItem>
                              </Tooltip>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <button onClick={() => handleEditorChange(doc._id)}>
                        <div className="w-full h-[180px] bg-white flex justify-center items-center rounded-xl">
                          <FileTextTwoTone className="text-[30px] sm:text-[50px]" />
                        </div>
                      </button>
                      <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Tooltip title={doc?.owner}>
                            <span className="text-[12px]">
                              Owner:{" "}
                              <Avatar icon={<UserOutlined />} size={20} />
                            </span>
                          </Tooltip>
                        </div>
                        <span className="text-[12px]">
                          Last modified: {formatCreatedAt(doc?.updatedAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-[90%] flex flex-wrap justify-start">
                {currentDocuments.map((folder: any) => {
                  return (
                    <div
                      key={folder?._id}
                      className="w-[30%] flex flex-col bg-[#F0F4F9] mb-4 p-4 rounded-xl gap-2 mr-9"
                    >
                      <div className="flex w-full justify-between">
                        <FolderOpenTwoTone className="text-[20px]" />
                        <button>{folder?.title}</button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="hover:bg-gray-200 w-10">
                            <EllipsisOutlined />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-2">
                            <div className="flex items-center gap-4">
                              <Tooltip placement="topRight" title="Edit Title">
                                <DropdownMenuItem disabled={isDisabled}>
                                  <EditOutlined />
                                </DropdownMenuItem>
                              </Tooltip>
                              <Tooltip placement="topRight" title="Add File">
                                <DropdownMenuItem disabled={isDisabled}>
                                  <PlusCircleOutlined />
                                </DropdownMenuItem>
                              </Tooltip>
                              <Tooltip placement="topRight" title="Delete">
                                <DropdownMenuItem disabled={isDisabled}>
                                  <DeleteOutlined />
                                </DropdownMenuItem>
                              </Tooltip>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <button>
                        <div className="w-full h-[180px] bg-white flex justify-center items-center rounded-xl">
                          <FolderOpenTwoTone className="text-[30px] sm:text-[50px]" />
                        </div>
                      </button>
                      <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="text-[12px]">
                            Owner:{" "}
                            <Tooltip placement="topRight" title={folder?.owner}>
                              <Avatar icon={<UserOutlined />} size={20} />
                            </Tooltip>
                          </span>
                        </div>
                        <span className="text-[12px]">
                          Last modified: {formatCreatedAt(folder?.updatedAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="w-[90%] flex fixed bottom-1 justify-center mt-4">
              <Pagination
                current={currentPage}
                total={paginatedDocuments.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
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
              className={`bg-blue-500 text-white w-[70px] rounded h-[30px] mr-2`}
              disabled={isDisabled}
              onClick={handlePermissionChange}
            >
              {isDisabledSave ? <SpinButton /> : "Save"}
            </button>,
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
              <div className="flex w-full gap-2">
                <Input
                  placeholder="email-user"
                  className="h-[36px] w-[80%] rounded-md"
                  onChange={handleInputShareDocument}
                  value={newUser}
                />
                <Select
                  defaultValue={permission}
                  onChange={setPermission}
                  className="h-[36px] !w-[20%]"
                  style={{ border: 0 }}
                >
                  <Option value="view">
                    <EyeOutlined className="mr-1" />
                    View
                  </Option>
                  <Option value="edit">
                    <EditOutlined className="mr-1" />
                    Edit
                  </Option>
                </Select>
              </div>
            </Form.Item>
          </Form>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">People with access</span>
            <div className="flex flex-col justify-center items-start gap-3">
              {userOwners.map((owner, index) => (
                <div
                  className="flex items-center justify-between gap-1 w-full"
                  key={index}
                >
                  <div className="flex items-center gap-1 max-w-[70%]">
                    <Avatar icon={<UserOutlined />} />
                    <span>{owner.email}</span>
                  </div>
                  <div className="w-[20%]">
                    <Select
                      defaultValue={owner.permission}
                      className="h-[36px] !w-[100%]"
                      onChange={(value) =>
                        handleSelectChange(value, owner.email)
                      }
                      style={{ border: 0 }}
                    >
                      <Option value="view">
                        <EyeOutlined className="mr-1" />
                        View
                      </Option>
                      <Option value="edit">
                        <EditOutlined className="mr-1" />
                        Edit
                      </Option>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        {/* MODAL ADD FOLDER */}
        <Modal
          title="Add Folder"
          open={openModalAddFolder}
          onCancel={handleCancelModalAddFolder}
          footer={[
            <button
              className="bg-blue-500 text-white w-[70px] rounded h-[30px]"
              disabled={isDisabled}
              onClick={handleAddFolder}
            >
              {isDisabled ? <SpinButton /> : "Add"}
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
                  Name <span className="text-red-500">*</span>
                </span>
              }
              name="newFolder"
              rules={[
                { required: true, message: "Please input name folder!" },
                {
                  min: 1,
                  message: "Name folder must be at least 1 characters long!",
                },
                {
                  max: 30,
                  message: "Name folder must be at most 30 characters long!",
                },
                {
                  pattern: /^[a-zA-Z0-9-_]+$/,
                  message:
                    "Name folder can only contain letters, numbers, hyphens (-) and underscores (_)",
                },
              ]}
            >
              <Input
                placeholder="example-name"
                className="h-[36px]"
                onChange={handleInputAddModal}
                value={newFolder}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* MODAL DELETE FOlDER */}
        <Modal
          open={openModalDeleteFolder}
          title="Are you sure you want to delete folder?"
          onCancel={handleCancelModalDeleteFolder}
          footer={[
            <button
              className="bg-white text-black border-2 w-[70px] !mr-[10px] rounded h-[30px] hover:scale-[1.1]"
              onClick={handleCancelModalDeleteFolder}
              disabled={isDisabled}
            >
              Return
            </button>,
            <button
              className="bg-red-500 text-white w-[70px] rounded h-[30px] hover:scale-[1.1]"
              onClick={() => handleDeleteFolder(idDocument)}
              disabled={isDisabled}
            >
              {isDisabled ? <SpinButton /> : <span>Delete</span>}
            </button>,
          ]}
        ></Modal>

        {/* MODAL RENAME FOLDER */}
        <Modal
          title="Rename Folder"
          open={openModalChangeNameFolder}
          onCancel={handleCancelModalChangeNameFolder}
          footer={[
            <button
              className="bg-blue-500 text-white w-[70px] rounded h-[30px]"
              disabled={isDisabled}
              onClick={handleChangeNameFolder}
            >
              {isDisabled ? <SpinButton /> : "Rename"}
            </button>,
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleChangeNameFolder}
          >
            <Form.Item
              label={
                <span className="text-[14px]">
                  Name <span className="text-red-500">*</span>
                </span>
              }
              name="newNameFolder"
              rules={[
                { required: true, message: "Please input your Name Folder!" },
                {
                  min: 1,
                  message: "Name must be at least 1 characters long!",
                },
                {
                  max: 30,
                  message: "Name must be at most 30 characters long!",
                },
                {
                  pattern: /^[a-zA-Z0-9-_]+$/,
                  message:
                    "Title can only contain letters, numbers, hyphens (-) and underscores (_)",
                },
              ]}
            >
              <Input
                placeholder="example-name"
                className="h-[36px]"
                onChange={handleInputChangeNameFolder}
                value={newNameFolder}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* MODAL ADD FILE IN FOLDER */}
        <Modal
          open={openModalAddFileToFolder}
          title="Choose a File add Folder"
          onCancel={handleCancelModalAddFiletoFolder}
          footer={[
            <button
              className="bg-white text-black border-2 w-[70px] !mr-[10px] rounded h-[30px] hover:scale-[1.1]"
              onClick={handleCancelModalAddFiletoFolder}
              disabled={isDisabled}
            >
              Return
            </button>,
            <button
              className="bg-blue-500 text-white w-[70px] rounded h-[30px] hover:scale-[1.1]"
              onClick={() => handleAddFileFolder()}
              disabled={isDisabled}
            >
              {isDisabled ? <SpinButton /> : <span>Add File</span>}
            </button>,
          ]}
        >
          <div className="my-4">
            <Select
              style={{ width: "100%" }}
              placeholder="Select a folder"
              disabled={isDisabled}
              className="custom-select"
              onChange={(value) => setIdDocument(value)}
            >
              {documentArray.map((document: any) => (
                <Option key={document._id} value={document._id}>
                  {document.title}
                </Option>
              ))}
            </Select>
          </div>
        </Modal>

        {/* MODAL SHOW FILE IN FOLDER */}
        <Modal
          open={openModalShowFileFolder}
          title="Folder"
          onCancel={handleCancelModalShowFileInFolder}
          width={800}
          footer={[
            <button
              className="bg-white text-black border-2 w-[70px] !mr-[10px] rounded h-[30px] hover:scale-[1.1]"
              onClick={handleCancelModalShowFileInFolder}
              disabled={isDisabled}
            >
              Return
            </button>,
          ]}
        >
          <div className="w-[100%] flex flex-col gap-3">
            <div className="w-[100%] flex font-semibold border-b-2">
              <span className="w-[5%]">Type</span>
              <span className="w-[30%]">Name</span>
              <span className="w-[25%]">Owner</span>
              <span className="w-[20%]">Update At</span>
              <span className="w-[20%]">Edit</span>
            </div>
            {fileList.map((document: any) => {
              const userPermissions =
                document.permissions?.[userData?.userInfo?._id];
              const canEdit = userPermissions === "edit";

              return (
                <div className="w-[100%] flex border-b">
                  <span className="w-[5%] text-center">
                    <FileTextOutlined />
                  </span>
                  <button
                    className="w-[30%] text-start text-blue-500 underline truncate"
                    onClick={() =>
                      handleEditorChange(document._id, userPermissions)
                    }
                  >
                    {document?.title}
                  </button>
                  <span className="w-[25%]">{document?.owner}</span>
                  <span className="w-[20%]">
                    {formatCreatedAt(document?.updatedAt)}
                  </span>
                  <div className="w-[20%] flex gap-2">
                    <Tooltip title="Edit Title">
                      <button
                        onClick={() =>
                          handleShowModalChangeTitle(document?._id)
                        }
                        disabled={
                          isDisabled ||
                          (!canEdit &&
                            document?.owner !== userData?.userInfo?.email)
                        }
                      >
                        <EditOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip title="Download">
                      <button
                        onClick={() =>
                          handleDownloadDocument(
                            document?.content,
                            document?.title
                          )
                        }
                      >
                        <VerticalAlignBottomOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip title="Share">
                      <button
                        onClick={() =>
                          handleShowModalShareDocument(document?._id)
                        }
                        disabled={
                          isDisabled ||
                          (!canEdit &&
                            document?.owner !== userData?.userInfo?.email)
                        }
                      >
                        <ShareAltOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <button onClick={() => showModalDelete(document?._id)}>
                        <DeleteOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip title="Move out of folder">
                      <button onClick={() => handleShowModalRemoveDocumentFolder(document?._id)}>
                        <CloseCircleOutlined />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>

        {/* MODAL REMOVE DOCUMENT TO FOLDER */}
        <Modal
          open={openModalRemoveDocumentFolder}
          title="Are you sure you want to remove this document from the folder?"
          onCancel={handleCancelModalRemoveDocumentFolder}
          footer={[
            <button
              className="bg-white text-black border-2 w-[70px] !mr-[10px] rounded h-[30px] hover:scale-[1.1]"
              onClick={handleCancelModalRemoveDocumentFolder}
              disabled={isDisabled}
            >
              Return
            </button>,
            <button
              className="bg-red-500 text-white w-[70px] rounded h-[30px] hover:scale-[1.1]"
              onClick={handleRemoveDocumentFolder}
              disabled={isDisabled}
            >
              {isDisabled ? <SpinButton /> : <span>Remove</span>}
            </button>,
          ]}
        ></Modal>

        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <SpinPage />
          </div>
        )}
      </div>
    </>
  );
};

export default Storage;
