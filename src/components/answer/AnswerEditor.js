import {useEffect} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
import styled from 'styled-components';
import Responsive from "../common/Responsive";
import palette from "../../lib/styles/palette";


const EditorBlock = styled(Responsive)` /* 페이지 위아래 여백 지정 */
  height: 682px;
  padding-top: 1.25rem;
  padding-bottom: 5rem;

  @media (max-width: 1024px) {
    padding: 1rem;
  }

  @media (max-height: 1024px) {
    height: 512px;
  }
`;

const QuillWrapper = styled.div`

  padding-top: 0;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.08);
  background-color: ${palette.gray[0]};

  .ql-editor {
    min-height: 486px;
    max-height: 486px;
    font-size: 1.125rem;
    line-height: 1.5;

    @media (max-height: 1024px) {
      min-height: 360px;
      max-height: 360px;
    }
  }
`;

const AnswerEditor = ({quillElement, quillInstance, user}) => {

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'snow',
      // 로그인 여부 체크
      placeholder: user ? '답변을 입력하세요.' : '로그인 후 답변을 입력할 수 있습니다.',
      modules: {
        // https://quilljs.com/docs/modules/toolbar/ 참고
        toolbar: [
          [{header: '1'}, {header: '2'}],
          ['bold', 'italic', 'underline', 'strike'],
          [{list: 'ordered'}, {list: 'bullet'}],
          // ['blockquote', 'code-block', 'link', 'image'],
          ['blockquote', 'code-block', 'link'],
        ],
      },
    });

    // // ctrl + v 시, html 태그가 아닌 텍스트만 붙여넣기
    // quillInstance.current.clipboard.addMatcher (Node.ELEMENT_NODE, function (node, delta) {
    //   let plaintext = node.innerText
    //   let Delta = Quill.import('delta')
    //   return new Delta().insert(plaintext)
    // })

    if (!user) {
      quillInstance.current.disable();
    }

  }, []);

  return (
    <EditorBlock>
      <QuillWrapper>
        <div ref={quillElement}/>
      </QuillWrapper>
    </EditorBlock>
  );
};

export default AnswerEditor;