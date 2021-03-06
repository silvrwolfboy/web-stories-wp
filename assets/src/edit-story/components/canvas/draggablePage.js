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
import { forwardRef, useCallback } from 'react';

/**
 * Internal dependencies
 */
import DropZone from '../dropzone';
import { useStory } from '../../app/story';
import PagePreview from './pagepreview';

// Disable reason: forwardRef render functions do not support propTypes
/* eslint-disable react/prop-types */

function DraggablePageWithRef(
  {
    pageIndex,
    onClick,
    isActive,
    ariaLabel,
    width,
    height,
    dragIndicatorOffset,
  },
  ref
) {
  const {
    state: { pages },
    actions: { setCurrentPage, arrangePage },
  } = useStory();

  const getArrangeIndex = (sourceIndex, dstIndex, position) => {
    // If the dropped element is before the dropzone index then we have to deduct
    // that from the index to make up for the "lost" element in the row.
    const indexAdjustment = sourceIndex < dstIndex ? -1 : 0;
    if ('left' === position.x) {
      return dstIndex + indexAdjustment;
    }
    return dstIndex + 1 + indexAdjustment;
  };

  const onDragStart = useCallback(
    (evt) => {
      const pageData = {
        type: 'page',
        index: pageIndex,
      };
      evt.dataTransfer.setData('text', JSON.stringify(pageData));
    },
    [pageIndex]
  );

  const onDrop = (evt, { position }) => {
    const droppedEl = JSON.parse(evt.dataTransfer.getData('text'));
    if (!droppedEl || 'page' !== droppedEl.type) {
      return;
    }
    const arrangedIndex = getArrangeIndex(droppedEl.index, pageIndex, position);
    // Do nothing if the index didn't change.
    if (droppedEl.index !== arrangedIndex) {
      const pageId = pages[droppedEl.index].id;
      arrangePage({ pageId, position: arrangedIndex });
      setCurrentPage({ pageId });
    }
  };

  return (
    <DropZone
      onDrop={onDrop}
      pageIndex={pageIndex}
      dragIndicatorOffset={dragIndicatorOffset}
    >
      <PagePreview
        index={pageIndex}
        draggable="true"
        onClick={onClick}
        onDragStart={onDragStart}
        isActive={isActive}
        aria-label={ariaLabel}
        width={width}
        height={height}
        forwardedRef={ref}
      />
    </DropZone>
  );
}

const DraggablePage = forwardRef(DraggablePageWithRef);

export default DraggablePage;

/* eslint-enable react/prop-types */
