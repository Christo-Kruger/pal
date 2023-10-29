import React from 'react';
import { MdDateRange, MdPlace, MdAccessTime } from 'react-icons/md';
import moment from 'moment';
import { toast } from 'react-toastify';

const BookPresentations = ({ presentations, toggleExpandCard, expandedPresentation, handleBooking, getUserId, triggerRefe }) => {
  return (
    <div className="presentations-grid">
      {presentations.map((presentation) => (
        <div
          key={presentation._id}
          className={`presentation-card ${expandedPresentation === presentation._id ? 'expanded' : ''}`}
        >
          <h3>{presentation.name}</h3>
          <div className="presentation-meta">
            <h5>
              <MdDateRange /> 일시:{" "}
              {new Date(presentation.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </h5>
            <h5>
              <MdPlace /> 장소: {presentation.location}
            </h5>
          </div>
       
          {presentation.description.length > 100 && (
            <button
              className="view-more"
              onClick={() => toggleExpandCard(presentation._id)}
            >
              {expandedPresentation === presentation._id
                ? '간단히 보기'
                : '더보기'}
            </button>
          )}
          <h4>
            <MdAccessTime /> 시간
          </h4>
          <div className="time-slots">
            {presentation.timeSlots ? (
              presentation.timeSlots.map((slot) => (
                <div
                  className="time-slot"
                  onClick={() => {
                    if (slot.attendeeCount>= slot.maxAttendees) {
                      toast.error('이미 완전히 예약되었습니다.');
                    }
                  }}
                >
                  <div className="slot-time">
                    {moment(slot.startTime).format('HH:mm')}
                  </div>
                  <div className="slot-info">
                    <button
                      className={`slotButton${
                        slot.attendeeCount >= slot.maxAttendees || slot.isUserAttending
                          ? ' disabled-slot'
                          : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBooking(
                          presentation._id,
                          slot.slotId,
                          presentation.name,
                          moment(slot.startTime).format('HH:mm')
                          tri
                        );
                      }}
                      disabled={
                        slot.attendeeCount>= slot.maxAttendees || slot.isUserAttending
                      }
                    >
                      {slot.attendeeCount >= slot.maxAttendees
                        ? '예약마감'
                        : '예약'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>이 프리젠테이션에 사용할 수 있는 시간이 없습니다.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookPresentations;