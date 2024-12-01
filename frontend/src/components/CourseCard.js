import React from 'react';

export default function CourseCard({ course }) {
  return (
    <a
      href={`/courses/${course.ID}`}
      className="max-w-[40vw] aspect-[9/8] hover:underline"
      aria-label={`View course: ${course.title}`}
    >
      <div className="bg-gray-100 rounded shadow hover:bg-gray-300 flex flex-col h-full w-full outline outline-1 outline-black/25">
        {/* Thumbnail */}
        <div className="h-[60%]">
          <img
            className="rounded outline outline-1 outline-black/40 object-fill w-full h-full block aspect-[16/9]"
            src={`${process.env.PUBLIC_URL}/content/${course.ID}/thumbnail.png`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `/default_thumbnails/tn${course.ID % 5}.png`;
            }}
            alt={`${course.title} Thumbnail`}
          />
        </div>

        {/* Course Information */}
        <div className="h-[40%] p-2 md:p-4 xl:p-2 overflow-hidden">
          <h3 className="text-base font-semibold truncate overflow-hidden">
            {course.title}
          </h3>
          <p className="truncate overflow-hidden">{course.description}</p>
        </div>
      </div>
    </a>
  );
}
