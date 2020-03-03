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

/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { COMPACT_THUMB_WIDTH, COMPACT_THUMB_HEIGHT } from '../layout';

function CompactIndicatorWithRef({ onClick, isActive, ariaLabel, role }, ref) {
  return (
    <Indicator
      onClick={onClick}
      isActive={isActive}
      aria-label={ariaLabel}
      role={role}
      ref={ref}
    />
  );
}

const Indicator = styled.button`
  display: block;
  width: ${COMPACT_THUMB_WIDTH}px;
  height: ${COMPACT_THUMB_HEIGHT}px;
  border: 0;
  background: #ffffff;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.28)};
  cursor: pointer;
`;

const CompactIndicator = forwardRef(CompactIndicatorWithRef);

CompactIndicator.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  ariaLabel: PropTypes.string.isRequired,
  role: PropTypes.string,
};

CompactIndicatorWithRef.propTypes = CompactIndicator.propTypes;

export default CompactIndicator;
