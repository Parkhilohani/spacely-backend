function sm2Review(task, quality) {
  let easiness = task.stability || 2.5;
  let reps = task.reps || 0;
  let lapses = task.lapses || 0;
  let interval = task.scheduled_days || 1;

  if (quality < 3) {
    reps = 0;
    interval = 1;
    lapses += 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * easiness);
  }

  easiness = Math.max(1.3, easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  const now = new Date();
  const nextReviewDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
  const elapsed_days = task.last_review ? Math.floor((now - new Date(task.last_review)) / (1000 * 60 * 60 * 24)) : 0;

  return {
    reps,
    lapses,
    easiness,
    scheduled_days: interval,
    last_review: now,
    nextReviewDate,
    elapsed_days,
    state: quality < 3 ? "learning" : "review",
  };
}

module.exports = sm2Review;
