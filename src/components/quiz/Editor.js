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
    padding: 0 1rem;
  }
`;

const TitleInput = styled.input`
  background: none;
  font-size: 1.75rem;
  outline: none;
  padding-bottom: 0.5rem;
  padding-top: 1.5rem;
  padding-left: 0.5rem; 

  @media (max-height: 1024px) {
    padding-top: 0;
  }
  
  border: none;
  border-bottom: 1px solid ${palette.gray[4]};
  margin-bottom: 2rem;
  width: 100%;
`;

const QuillWrapper = styled.div`

  padding-top: 0;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.08);
  
  .ql-editor {
    background-color: ${palette.gray[0]};
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

const Editor = ({onChangeField, quillElement, quillInstance, title, contents}) => {

  const onChangeTitle = e => {
    onChangeField({ key: 'title', value: e.target.value });
  };

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'snow',
      // 이전 포스트의 내용이 있다면, PlaceHolder 제거
      placeholder: !contents ? '내용을 작성하세요' : '',
      modules: {
        // https://quilljs.com/docs/modules/toolbar/ 참고
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean']                                         // remove formatting button
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

    // // ctrl + v 시, html 태그가 아닌 텍스트만 붙여넣기
    // quill.clipboard.addMatcher (Node.ELEMENT_NODE, function (node, delta) {
    //   let plaintext = node.innerText
    //   let Delta = Quill.import('delta')
    //   return new Delta().insert(plaintext)
    // })

    // 이전 포스트의 내용이 있다면, 이전 내용을 불러오기
    if (contents !== '') {
      quill.root.innerHTML = contents;
    }

  }, [onChangeField]);

  return (
    <EditorBlock>
      <TitleInput placeholder="제목을 입력하세요"
                  defaultValue={title}
                  onChange={onChangeTitle}/>
      <QuillWrapper>
        <div ref={quillElement}/>
      </QuillWrapper>
    </EditorBlock>
  );
};

export default Editor;