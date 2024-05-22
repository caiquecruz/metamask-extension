import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode.react';
import { UR, UREncoder } from '@ngraveio/bc-ur';
import PropTypes from 'prop-types';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import {
  AlignItems,
  Display,
  FlexDirection,
  TextAlign,
} from '../../../../helpers/constants/design-system';
import { PageContainerFooter } from '../../../ui/page-container';
import { Text, Box } from '../../../component-library';

const Player = ({ type, cbor, cancelQRHardwareSignRequest, toRead }) => {
  const t = useI18nContext();
  const [interval, setIntervalValue] = useState(100);
  const [maxFragmentLength, setMaxFragmentLength] = useState(200);
  const [qrSize, setQRSize] = useState(250);
  const [level, setLevel] = useState('L');

  const urEncoder = useMemo(
    () =>
      new UREncoder(new UR(Buffer.from(cbor, 'hex'), type), maxFragmentLength),
    [cbor, type, maxFragmentLength],
  );
  const [currentQRCode, setCurrentQRCode] = useState(urEncoder.nextPart());

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentQRCode(urEncoder.nextPart());
    }, interval);
    return () => {
      clearInterval(id);
    };
  }, [urEncoder, interval, level]);

  return (
    <>
      <Box>
        <Text align={TextAlign.Center}>
          {t('QRHardwareSignRequestSubtitle')}
        </Text>
      </Box>
      <Box
        paddingTop={4}
        paddingBottom={4}
        display={Display.Flex}
        alignItems={AlignItems.center}
        flexDirection={FlexDirection.Column}
      >
        <div
          style={{
            padding: 20,
            backgroundColor: 'var(--qr-code-white-background)',
          }}
        >
          <QRCode
            value={currentQRCode.toUpperCase()}
            size={qrSize}
            level={level}
          />
        </div>
      </Box>
      <Box paddingBottom={4} paddingLeft={4} paddingRight={4}>
        <Text align={TextAlign.Center}>
          {t('QRHardwareSignRequestDescription')}
        </Text>
      </Box>
      <Box
        paddingBottom={4}
        paddingLeft={4}
        paddingRight={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Text align={TextAlign.Center}>QR Code Interval ({interval} ms)</Text>
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={interval}
          onChange={(e) => setIntervalValue(Number(e.target.value))}
        />
        <Text align={TextAlign.Center}>
          Max Fragment Length {maxFragmentLength}
        </Text>
        <input
          type="range"
          min="10"
          max="1500"
          step="1"
          value={maxFragmentLength}
          onChange={(e) => setMaxFragmentLength(Number(e.target.value))}
        />
        <Text align={TextAlign.Center}>QR Code Size {qrSize}</Text>
        <input
          type="range"
          min="10"
          max="500"
          step="1"
          value={qrSize}
          onChange={(e) => setQRSize(Number(e.target.value))}
        />
        <Box paddingTop={4} paddingBottom={4} paddingLeft={4} paddingRight={4}>
          <Text align={TextAlign.Center}>Error Correction Level</Text>
          <>
            <input
              type="radio"
              id="levelL"
              name="level"
              value="L"
              checked={level === 'L'}
              onChange={handleLevelChange}
            />
            <label htmlFor="levelL">Low (L)</label>
            <br />
            <input
              type="radio"
              id="levelM"
              name="level"
              value="M"
              checked={level === 'M'}
              onChange={handleLevelChange}
            />
            <label htmlFor="levelM">Medium (M)</label>
            <br />
            <input
              type="radio"
              id="levelQ"
              name="level"
              value="Q"
              checked={level === 'Q'}
              onChange={handleLevelChange}
            />
            <label htmlFor="levelQ">Quartile (Q)</label>
            <br />
            <input
              type="radio"
              id="levelH"
              name="level"
              value="H"
              checked={level === 'H'}
              onChange={handleLevelChange}
            />
            <label htmlFor="levelH">High (H)</label>
          </>
        </Box>
      </Box>
      <PageContainerFooter
        onCancel={cancelQRHardwareSignRequest}
        onSubmit={toRead}
        cancelText={t('QRHardwareSignRequestCancel')}
        submitText={t('QRHardwareSignRequestGetSignature')}
        submitButtonType="confirm"
      />
    </>
  );
};

Player.propTypes = {
  type: PropTypes.string.isRequired,
  cbor: PropTypes.string.isRequired,
  cancelQRHardwareSignRequest: PropTypes.func.isRequired,
  toRead: PropTypes.func.isRequired,
};

export default Player;
