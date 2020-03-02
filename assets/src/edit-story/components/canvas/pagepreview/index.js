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
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import useStory from '../../../app/story/useStory';
import { TransformProvider } from '../../transform';
import { UnitsProvider } from '../../../units';
import DisplayElement from '../displayElement';

export const PAGE_THUMB_OUTLINE = 3;

const Page = styled.button`
  display: block;
  padding: 0;
  border: ${PAGE_THUMB_OUTLINE}px solid
    ${({ isActive, theme }) =>
      isActive ? theme.colors.selection : theme.colors.bg.v1};
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  background-color: ${({ theme }) => theme.colors.mg.v1};
  flex: none;
  transition: width 0.2s ease, height 0.2s ease;
`;

const PreviewWrapper = styled.div`
  height: 100%;
  position: relative;
  overflow: hidden;
`;

function PagePreview({ index, forwardedRef, ...props }) {
  const {
    state: { pages },
  } = useStory();
  const page = pages[index];
  const { width, height } = props;
  return (
    <UnitsProvider pageSize={{ width, height }}>
      <TransformProvider>
        <Page {...props} ref={forwardedRef}>
          <PreviewWrapper>
            {page.elements.map(({ id, ...rest }) => (
              <DisplayElement key={id} element={{ id, ...rest }} />
            ))}
          </PreviewWrapper>
        </Page>
      </TransformProvider>
    </UnitsProvider>
  );
}

PagePreview.propTypes = {
  index: PropTypes.number.isRequired,
  forwardedRef: PropTypes.func,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default PagePreview;
