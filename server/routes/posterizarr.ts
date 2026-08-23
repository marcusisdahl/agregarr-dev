import posterizarrTriggerJob from '@server/lib/posterizarrTrigger';
import { Router } from 'express';

const router = Router();

router.post('/trigger', (req, res) => {
  const { ratingKey, title, mediaType } = req.body ?? {};

  if (typeof ratingKey !== 'string' || !/^[1-9]\d*$/.test(ratingKey.trim())) {
    return res.status(400).json({
      error: 'ratingKey is required and must be a positive Plex rating key',
    });
  }
  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({ error: 'title must be a string' });
  }
  if (
    mediaType !== undefined &&
    mediaType !== 'movie' &&
    mediaType !== 'show'
  ) {
    return res.status(400).json({ error: 'mediaType must be movie or show' });
  }

  const normalizedRatingKey = ratingKey.trim();
  const result = posterizarrTriggerJob.enqueue({
    ratingKey: normalizedRatingKey,
    title,
    mediaType,
  });

  return res.status(202).json({
    message: result.deduplicated
      ? 'Posterizarr item trigger was already queued or recently completed'
      : 'Posterizarr item trigger queued',
    ratingKey: normalizedRatingKey,
    ...result,
  });
});

router.get('/status', (_req, res) => {
  return res.status(200).json(posterizarrTriggerJob.status);
});

export default router;
