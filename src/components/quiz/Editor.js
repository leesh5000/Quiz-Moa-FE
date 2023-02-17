import {useEffect} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
import styled from 'styled-components';
import palette from "../../lib/styles/palette";
import Responsive from "../common/Responsive";


const EditorBlock = styled(Responsive)` /* 페이지 위아래 여백 지정 */
  height: 400px;
  padding-top: 1.25rem;
  padding-bottom: 5rem;

  @media (max-width: 1024px) {
    padding: 0 0.5rem;
  }
`;

const TitleInput = styled.input`
  font-size: 1.75rem;
  outline: none;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-top: 1.5rem;

  @media (max-height: 1024px) {
    padding-top: 1rem;
    padding-bottom: 0;
  }
  
  border: none;
  border-bottom: 1px solid ${palette.gray[4]};
  margin-bottom: 2rem;
  width: 100%;
`;

const QuillWrapper = styled.div`

  padding-top: 0;
  
  .ql-editor {
    min-height: 812px;
    max-height: 812px;
    font-size: 1.125rem;
    line-height: 1.5;

    @media (max-height: 1024px) {
      min-height: 486px;
      max-height: 486px;
    }

    @media (max-height: 720px) {
      min-height: 312px;
      max-height: 312px;
    }

  }
`;

const Editor = ({onChangeField, quillElement, quillInstance}) => {

  console.log("Editor Rendering...");

  const onChangeTitle = e => {
    onChangeField({ key: 'title', value: e.target.value });
  };

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'snow',
      placeholder: '내용을 작성하세요',
      modules: {
        // https://quilljs.com/docs/modules/toolbar/ 참고
        toolbar: [
          [{header: '1'}, {header: '2'}],
          ['bold', 'italic', 'underline', 'strike'],
          [{list: 'ordered'}, {list: 'bullet'}],
          ['blockquote', 'code-block', 'link', 'image'],
        ],
      },
    });

    // 참고: https://quilljs.com/docs/api/#events
    const quill = quillInstance.current;
    quill.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        onChangeField({key: 'body', value: quill.root.innerHTML});
      }
    });
  }, [onChangeField]);

  return (
    <EditorBlock>
      <TitleInput placeholder="제목을 입력하세요"
                  onChange={onChangeTitle}/>
      <QuillWrapper>
        <div ref={quillElement}/>
      </QuillWrapper>
    </EditorBlock>
  );
};

export default Editor;