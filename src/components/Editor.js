import {useEffect} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
import styled from 'styled-components';
import palette from "../lib/styles/palette";
import Responsive from "./common/Responsive";


const EditorBlock = styled(Responsive)` /* 페이지 위아래 여백 지정 */
  height: 960px;
  padding-top: 5rem;
  padding-bottom: 5rem;

  @media (max-height: 1024px) {
    height: 768px;
  }

`;

const TitleInput = styled.input`
  font-size: 2rem;
  outline: none;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[4]};
  margin-bottom: 2rem;
  width: 100%;
`;

const QuillWrapper = styled.div`

  .ql-editor {
    min-height: 680px;
    max-height: 680px;
    font-size: 1.125rem;
    line-height: 1.5;

    @media (max-height: 1024px) {
      min-height: 608px;
    }
    
  }
`;

const Editor = ({onChangeField, quillElement, quillInstance}) => {

  // const quillElement = useRef(null); // Quill을 적용할 DivElement를 설정
  // const quillInstance = useRef(null); // Quill 인스턴스를 설정

  console.log("Editor Rendering...");

  const onChangeTitle = e => {
    onChangeField({ key: 'title', value: e.target.value });
  };

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'snow',
      placeholder: '내용을 작성하세요...',
      modules: {
        // 더 많은 옵션
        // https://quilljs.com/docs/modules/toolbar/ 참고
        toolbar: [
          [{header: '1'}, {header: '2'}],
          ['bold', 'italic', 'underline', 'strike'],
          [{list: 'ordered'}, {list: 'bullet'}],
          ['blockquote', 'code-block', 'link', 'image'],
        ],
      },
    });

    // quill에 text-change 이벤트 핸들러 등록
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
                   onChange={onChangeTitle}
       />
       <QuillWrapper>
        <div ref={quillElement}/>
      </QuillWrapper>
    </EditorBlock>
  );
};

export default Editor;