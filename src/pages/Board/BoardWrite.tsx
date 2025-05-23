import Header from '../../layouts/Header';
import styles from './BoardWrite.module.scss';
import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { InputField } from '../../components/common/InputField/InputField';
import { useBoardWrite } from '../../hooks/useBoardWrite';
import { useBoardDetail } from '../../hooks/useBoardDetail';

const NotImage = () => {
  return (
    <div className={styles['not-image']}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles['not-image__icon']}
        preserveAspectRatio="none"
      >
        <path
          d="M12.5 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H17C17.93 21 18.395 21 18.7765 20.8978C19.8117 20.6204 20.6204 19.8117 20.8978 18.7765C21 18.395 21 17.93 21 17M19 8V2M16 5H22M10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5ZM14.99 11.9181L6.53115 19.608C6.05536 20.0406 5.81747 20.2568 5.79643 20.4442C5.77819 20.6066 5.84045 20.7676 5.96319 20.8755C6.10478 21 6.42628 21 7.06929 21H16.456C17.8951 21 18.6147 21 19.1799 20.7582C19.8894 20.4547 20.4547 19.8894 20.7582 19.1799C21 18.6147 21 17.8951 21 16.456C21 15.9717 21 15.7296 20.9471 15.5042C20.8805 15.2208 20.753 14.9554 20.5733 14.7264C20.4303 14.5442 20.2412 14.3929 19.8631 14.0905L17.0658 11.8527C16.6874 11.5499 16.4982 11.3985 16.2898 11.3451C16.1061 11.298 15.9129 11.3041 15.7325 11.3627C15.5279 11.4291 15.3486 11.5921 14.99 11.9181Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Todo: 게시글 작성 API 연동 && 에러 처리 && 이미지 삭제 버튼 UI 확인
export const BoardWrite = () => {
  const { feedId } = useParams();
  const editMode = !!feedId;
  const {
    title,
    setTitle,
    content,
    setContent,
    images,
    setImages,
    handleImageUpload,
    handleImageDelete,
    handleSubmit,
    setFeedType,
    setApartmentId,
  } = useBoardWrite(Number(feedId));

  const { data: boardDetail } = useBoardDetail(Number(feedId));

  useEffect(() => {
    if (editMode && boardDetail) {
      setTitle(boardDetail.title);
      setContent(boardDetail.contents);
      setFeedType(boardDetail.feedType);
      setApartmentId(boardDetail.apartmentId);

      if (
        boardDetail.s3ObjectResponseDtoList &&
        boardDetail.s3ObjectResponseDtoList.length > 0
      ) {
        const urls = boardDetail.s3ObjectResponseDtoList.map(
          (img: { fullUrl: string; url: string }) => ({
            fullUrl: img.fullUrl,
            url: img.url,
          })
        );
        setImages(urls);
      }
    }
  }, [editMode, boardDetail]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Header
        title={editMode ? '글 수정' : '글쓰기'}
        type="sub"
        hasBackButton={true}
        hasText={true}
        hasRightButton={true}
        hasIcons={true}
        buttonText={editMode ? '수정' : '등록'}
        onClickButton={handleSubmit}
      />
      <div className={styles['board-write']}>
        <InputField
          label="제목"
          name="title"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={styles['board-write__content']}
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력해주세요."
        ></textarea>
        <span className={styles['board-write__image-label']}>사진첨부</span>
        <div className={styles['board-write__image']}>
          {images.length === 0 && (
            <div onClick={triggerImageUpload}>
              <NotImage />
            </div>
          )}
          {images.length === 0 && (
            <p className={styles['board-write__image-description']}>
              390 * 460
              <br /> 최대 10장의 이미지 첨부가 가능합니다.
            </p>
          )}
          {images.map((image, idx) => {
            const imageUrl =
              typeof image === 'string'
                ? image
                : image instanceof File
                  ? URL.createObjectURL(image)
                  : image.fullUrl;
            return (
              <div key={idx} className={styles['board-write__image-preview']}>
                <img src={imageUrl} alt={`upload-${idx}`} />
                <button onClick={() => handleImageDelete(idx)}>
                  <svg
                    width={10}
                    height={10}
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M9 1L1 9M1 1L9 9"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            );
          })}

          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </div>
      </div>
    </div>
  );
};
