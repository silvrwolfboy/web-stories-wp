/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useRef, useEffect } from 'react';

/**
 * Internal dependencies
 */
import getCaretCharacterOffsetWithin from '../../utils/getCaretCharacterOffsetWithin';
import { useStory } from '../../app';
import { useCanvas } from '../../components/canvas';
import { useUnits } from '../../units';
import { elementFillContent, elementWithFont } from '../shared';
import StoryPropTypes from '../../types';
import { generateFontFamily } from './util';

const Element = styled.p`
  margin: 0;
  ${elementFillContent}
  ${elementWithFont}

	opacity: 0;
  user-select: none;
`;

function TextFrame({
  element: {
    id,
    content,
    fontFamily,
    fontFallback,
    fontSize,
    fontWeight,
    fontStyle,
  },
  wrapperRef,
}) {
  const {
    actions: { dataToEditorY },
  } = useUnits();
  const props = {
    fontFamily: generateFontFamily(fontFamily, fontFallback),
    fontFallback,
    fontStyle,
    fontSize: dataToEditorY(fontSize),
    fontWeight,
  };
  const {
    state: { selectedElementIds },
  } = useStory();

  const {
    actions: { setEditingElementWithState },
  } = useCanvas();
  const isElementSelected = selectedElementIds.includes(id);
  const isElementOnlySelection =
    isElementSelected && selectedElementIds.length === 1;

  const elementRef = useRef();

  useEffect(() => {
    if (!isElementOnlySelection) {
      return undefined;
    }

    const wrapper = wrapperRef.current;
    const element = elementRef.current;

    let clickTime = 0;

    const handleKeyDown = (evt) => {
      if (evt.metaKey || evt.altKey || evt.ctrlKey) {
        // Some modifier (except shift) was pressed. Ignore and bubble
        return;
      }

      if (evt.key === 'Enter') {
        // Enter editing without writing or selecting anything
        setEditingElementWithState(id, { selectAll: true });
        evt.stopPropagation();
        // Make sure no actual Enter is pressed
        evt.preventDefault();
      } else if (/^\w$/.test(evt.key)) {
        // TODO: in above check all printable characters across alphabets, no just a-z0-9 as \w is
        // Enter editing and clear content (first letter will be correctly inserted from keyup)
        setEditingElementWithState(id, { clearContent: true });
        evt.stopPropagation();
      }
    };

    const handleMouseDown = () => {
      clickTime = window.performance.now();
    };

    const handleMouseUp = (evt) => {
      const timingDifference = window.performance.now() - clickTime;

      if (timingDifference > 300) {
        // Only short clicks count.
        return;
      }

      // Enter editing mode and place cursor at current selection offset
      evt.stopPropagation();
      setEditingElementWithState(id, {
        offset: getCaretCharacterOffsetWithin(
          elementRef.current,
          evt.clientX,
          evt.clientY
        ),
      });
    };

    wrapper.addEventListener('keydown', handleKeyDown);
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    return () => {
      wrapper.removeEventListener('keydown', handleKeyDown);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, wrapperRef, isElementOnlySelection, setEditingElementWithState]);

  return (
    <Element
      ref={elementRef}
      dangerouslySetInnerHTML={{ __html: content }}
      {...props}
    />
  );
}

TextFrame.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  wrapperRef: PropTypes.object.isRequired,
};

export default TextFrame;
