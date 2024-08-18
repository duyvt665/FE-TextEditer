import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

import '@react-pdf-viewer/core/lib/styles/index.css';
import { message } from 'antd';
import './Tiny.css';
import { Base64 } from 'js-base64';
import apiService from '@/service/apiService';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import useFetchData from '@/service/component/getData';
import { MenuOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import MenuMobile from '@/pages/components/MenuMobile';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

declare global {
	interface Window {
		tinymce: any;
	}
}

const TinyMCEComponent = ({ documentId }: { documentId: any }) => {
	const [editorContent, setEditorContent] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const editorContentRef = useRef<string>('');
	const [disabled, setDisabled] = useState<boolean>(false);
	const [checkUpdate, setCheckUpdate] = useState<boolean>(false);
	const [isOpenMenu, setIsOpenMenu] = useState(false);
	const { data: documentData } = useFetchData(documentId ? `/user/infor-document/${documentId}` : null);
	const navigate = useNavigate();
	const socketRef = useRef<any>(null);
	const isExternalUpdate = useRef(false);
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	const singlePageWordLimitation: number = 500;
	const pageBreakCharacter: string = '<!-- This is custom page break divider -->';
	const whiteSpaceCharacter: string = '<p>&nbsp;</p>';

	//SOCKET IO
	useEffect(() => {
		socketRef.current = io('ws://localhost:5555');

		socketRef.current.on('document-update', (updatedContent: string) => {
			const decodedContent = Base64.decode(updatedContent);
			if (decodedContent !== editorContentRef.current) {
				isExternalUpdate.current = true;
				setEditorContent(decodedContent);
			}
		});

		if (documentId) {
			socketRef.current.emit('join-document', documentId);
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

	// HANDLE INSERT PAGE BREAK AUTOMATICALLY
	// purpose: Insert page break when content length exceed the one page limitation
	// Parameters:
	// 👉 content: content of the editor area in HTML format
	// 👉 editor: reference to the editor to active editor toolbar functionality
	const handleInsertPageBreak = (content: string, editor: TinyMCEEditor) => {
		const contentTrimText: string = content.trim();

		// Each statement divided by the Page Break element
		const statements: Array<string> = content.split(pageBreakCharacter);
		// Keep track only the newest statement to insert page break
		// when the statement's length exceeded
		const lastStatement = statements.at(-1) ?? '';

		// There are two cases to handle to break page
		// ✅ Case 1: The editor containing only 1 statements
		if (statements.length === 1 && lastStatement.length > singlePageWordLimitation) {
			// Use editor.getBody() to find the end of all the content
			editor.selection.setCursorLocation(editor.getBody(), editor.getBody().children.length);
			editor.execCommand('mcePageBreak');
		}
		// ✅ Case 2: The editor containing more than 1 statements
		// check if the statement is ends with page break element then
		// don't execute since editor.execCommand('mcePageBreak') can also trigger onChange event and cause an onChange loop
		if (statements.length > 1 && lastStatement.length > singlePageWordLimitation && !contentTrimText.endsWith(whiteSpaceCharacter)) {
			editor.selection.setCursorLocation(editor.getBody(), editor.getBody().children.length);
			editor.execCommand('mcePageBreak');
		}
	};

	// HANDLE EDITOR CHANGE
	// <!-- This is custom page break divider -->
	const handleEditorChange = (content: string, editor: TinyMCEEditor) => {
		// Insert page break when content length exceed the one page limitation
		handleInsertPageBreak(content, editor);

		if (!isExternalUpdate.current) {
			setEditorContent(content);
			editorContentRef.current = content;

			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}

			debounceRef.current = setTimeout(() => {
				const base64Content = Base64.encode(content);
				socketRef.current.emit('document-update', {
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
		setTitle('');
		setEditorContent('');
		editorContentRef.current = '';
		setCheckUpdate(false);
		navigate('/home', { replace: true });
		socketRef.current.disconnect();
	};

	//HANDLE SAVE DOCUMENT
	const handleSave = async () => {
		setDisabled(true);
		if (title === '') {
			message.error('Please input document title!');
			setTimeout(() => setDisabled(false), 2000);
			return;
		}
		try {
			const currentContent = editorContentRef.current;
			const base64Content = Base64.encode(currentContent);
			await apiService.post('/user/add-document', {
				title: title,
				content: base64Content,
			});
			message.success('Document saved successfully!');
			setTimeout(() => setDisabled(false), 2000);
		} catch (error) {
			setTimeout(() => setDisabled(false), 2000);
		}
	};

	//HANDLE UPDATE DOCUMENT
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (checkUpdate && editorContentRef.current !== '') {
				handleUpdate();
			}
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [editorContent]);

	const handleUpdate = async () => {
		setDisabled(false);
		if (title === '') {
			message.error('Please input document title!');
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

	return (
		<div className='h-[100%] relative'>
			<div className='w-[100%] h-[10%] flex justify-between items-center bg-[#F9FAFB] border-b'>
				<div className='flex w-[50%] justify-center items-center gap-2 ml-4 sm:w-[30%]'>
					<Label className='text-[20px]'>Title:</Label>
					<Input className='h-8' value={title} onChange={(e) => setTitle(e.target.value)} disabled={documentId} />
				</div>
				<div className='mr-4 flex gap-2'>
					<Button
						className='bg-blue-500 hover:bg-blue-600 rounded-xl'
						onClick={checkUpdate ? handleUpdate : handleSave}
						disabled={disabled}
					>
						Save
					</Button>
					<Button className='bg-blue-500 hover:bg-blue-600 rounded-xl' onClick={handleNewDocument}>
						New Document
					</Button>
					<Button className='bg-gray-200 hover:bg-gray-300 rounded-xl lg:hidden' onClick={handleShowMenuMobile}>
						{isOpenMenu ? (
							<MenuUnfoldOutlined className='!text-black text-[20px]' rotate={90} />
						) : (
							<MenuOutlined className='!text-black text-[20px]' />
						)}
					</Button>
					{isOpenMenu && (
						<div className='absolute top-[75px] right-[15px] z-20 md:top-[70px]'>
							<MenuMobile />
						</div>
					)}
				</div>
			</div>

			<div className='h-[90%]'>
				<Editor
					apiKey='8kpopll9pa8gpus8k7ikasqwm8wuktiabaxzl0fzh6txmk6x'
					value={editorContent}
					onEditorChange={handleEditorChange}
					init={{
						height: '100%',
						resize: false,
						menu: {
							file: {
								title: 'File',
								items: 'newdocument restoredraft | preview | print | openfile',
							},
							edit: {
								title: 'Edit',
								items: 'undo redo | cut copy paste pastetext | selectall | searchreplace',
							},
							view: {
								title: 'View',
								items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments',
							},
							insert: {
								title: 'Insert',
								items: 'link media image | template hr | pagebreak charmap emoticons | insertdatetime',
							},
							format: {
								title: 'Format',
								items:
									'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align | forecolor backcolor | removeformat',
							},
							tools: {
								title: 'Tools',
								items: 'spellchecker spellcheckerlanguage | code wordcount',
							},
							table: {
								title: 'Table',
								items: 'inserttable tableprops deletetable | cell row column',
							},
							help: {
								title: 'Help',
								items: 'help',
							},
							custom: {
								title: 'Save',
								items: 'save',
							},
						},
						menubar: 'file edit view insert format tools table help custom',
						plugins: [
							'advlist',
							'autolink',
							'link',
							'image',
							'lists',
							'charmap',
							'preview',
							'anchor',
							'pagebreak',
							'searchreplace',
							'wordcount',
							'visualblocks',
							'code',
							'fullscreen',
							'insertdatetime',
							'media',
							'table',
							'emoticons',
							'autosave',
							'save',
							'help',
							'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
						],
						toolbar:
							'undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl ',
						setup: (editor) => {
							editor.ui.registry.addMenuItem('save', {
								text: 'Save',
								onAction: handleSave,
							});
							editor.ui.registry.addMenuItem('openfile', {
								text: 'Open File',
								onAction: () => document.getElementById('file-input')?.click(),
							});
						},
						pagebreak_separator: '<!-- This is custom page break divider -->',
						pagebreak_split_block: true,
						automatic_uploads: true,
						autosave_restore_when_empty: true,
						autosave_ask_before_unload: true,
						save_onsavecallback: () => {
							message.success('Save Success!');
						},
						content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
						toolbar_mode: 'sliding',
						file_picker_types: 'file image media',
						file_picker_callback: (cb, meta: any) => {
							const input = document.createElement('input');
							input.setAttribute('type', 'file');
							if (meta.filetype === 'image') {
								input.setAttribute('accept', 'image/*');
							} else if (meta.filetype === 'media') {
								input.setAttribute('accept', 'video/*, audio/*');
							} else {
								input.setAttribute('accept', '*');
							}

							input.onchange = function (e) {
								const target = e.target as HTMLInputElement;
								const file = target.files?.[0];

								if (file) {
									const reader = new FileReader();
									reader.onload = function () {
										const base64 = reader.result?.toString().split(',')[1];
										const id = 'blobid' + new Date().getTime();
										const blobCache = window.tinymce?.activeEditor?.editorUpload.blobCache;
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
	);
};

export default TinyMCEComponent;
