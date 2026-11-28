const timeZone = 'Asia/Ho_Chi_Minh';
const defaultMockDate = '2026-11-06';
const textFields = ['name', 'hostClub', 'description', 'instructions'];
const dateFields = ['opensOn', 'closesOn'];
const writableFields = [...textFields, ...dateFields, 'departments'];
const departmentFields = ['id', 'name', 'positions'];
const positionFields = ['id', 'title', 'quota', 'description', 'requirements'];

function error(status, code, message, fieldErrors = {}, applicationIds = []) {
  return { status, body: { error: { code, message, fieldErrors: { ...fieldErrors }, applicationIds } } };
}

function invalid(fieldErrors) {
  return error(400, 'VALIDATION_FAILED', 'Check the highlighted fields.', fieldErrors);
}

function notFound() {
  return error(404, 'CAMPAIGN_NOT_FOUND', 'Campaign not found.');
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isId(value) {
  return typeof value === 'string' && value.length > 0 && value === value.trim();
}

function isDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function compare(a, b) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function checkKeys(record, fields, path, errors) {
  for (const key of Object.keys(record)) {
    if (!fields.includes(key)) errors[`${path}${key}`] = 'This field cannot be written.';
  }
}

function checkRowId(id, used, path, errors) {
  if (!isId(id)) errors[path] = 'Enter a non-empty ID without surrounding whitespace.';
  else if (used.has(id)) errors[path] = 'Use a unique ID.';
  else used.add(id);
}

function checkDepartments(departments, errors) {
  if (!Array.isArray(departments)) {
    errors.departments = 'Enter a list of departments.';
    return;
  }

  const departmentIds = new Set();
  const positionIds = new Set();
  for (const [index, department] of departments.entries()) {
    const path = `departments.${index}`;
    if (!isRecord(department)) {
      errors[path] = 'Enter a department object.';
      continue;
    }

    checkKeys(department, departmentFields, `${path}.`, errors);
    checkRowId(department.id, departmentIds, `${path}.id`, errors);
    if (typeof department.name !== 'string') errors[`${path}.name`] = 'Enter text.';
    if (!Array.isArray(department.positions)) {
      errors[`${path}.positions`] = 'Enter a list of positions.';
      continue;
    }

    for (const [positionIndex, position] of department.positions.entries()) {
      const positionPath = `${path}.positions.${positionIndex}`;
      if (!isRecord(position)) {
        errors[positionPath] = 'Enter a position object.';
        continue;
      }

      checkKeys(position, positionFields, `${positionPath}.`, errors);
      checkRowId(position.id, positionIds, `${positionPath}.id`, errors);
      for (const field of ['title', 'description', 'requirements']) {
        if (typeof position[field] !== 'string') errors[`${positionPath}.${field}`] = 'Enter text.';
      }
      if (position.quota !== null && !Number.isInteger(position.quota)) {
        errors[`${positionPath}.quota`] = 'Enter a whole number or leave the quota empty.';
      }
    }
  }
}

function validateWrite(body, creating = false) {
  if (!isRecord(body)) return invalid({ body: 'Enter a JSON object.' });

  const errors = Object.create(null);
  checkKeys(body, creating ? ['id', ...writableFields] : writableFields, '', errors);
  if (creating && !isId(body.id)) errors.id = 'Enter a non-empty ID without surrounding whitespace.';
  for (const field of textFields) {
    if (Object.hasOwn(body, field) && typeof body[field] !== 'string') errors[field] = 'Enter text.';
  }
  for (const field of dateFields) {
    if (Object.hasOwn(body, field) && body[field] !== null && !isDate(body[field])) {
      errors[field] = 'Enter a valid date in YYYY-MM-DD format.';
    }
  }
  if (Object.hasOwn(body, 'departments')) checkDepartments(body.departments, errors);
  if (Object.keys(errors).length) return invalid(errors);
}

function validatePublication(campaign) {
  const errors = {};
  for (const field of textFields) {
    if (!campaign[field].trim()) errors[field] = 'Enter a value.';
  }
  if (!isDate(campaign.opensOn)) errors.opensOn = 'Choose an application opening date.';
  if (!isDate(campaign.closesOn) || campaign.closesOn < campaign.opensOn) {
    errors.closesOn = 'Choose a closing date on or after applications open.';
  }
  if (!isDate(campaign.interviewDate) || campaign.interviewDate <= campaign.closesOn) {
    errors.interviewDate = 'Choose an interview date after applications close.';
  }

  if (!campaign.departments.length) errors.departments = 'Add at least one department.';
  for (const [index, department] of campaign.departments.entries()) {
    const path = `departments.${index}`;
    if (!department.name.trim()) errors[`${path}.name`] = 'Enter a department name.';
    if (!department.positions.length) errors[`${path}.positions`] = 'Add at least one position.';
    for (const [positionIndex, position] of department.positions.entries()) {
      const positionPath = `${path}.positions.${positionIndex}`;
      for (const field of ['title', 'description', 'requirements']) {
        if (!position[field].trim()) errors[`${positionPath}.${field}`] = 'Enter a value.';
      }
      if (!Number.isInteger(position.quota) || position.quota < 1) {
        errors[`${positionPath}.quota`] = 'Enter a positive whole number.';
      }
    }
  }

  if (Object.keys(errors).length) return invalid(errors);
}

function campaignDate() {
  return process.env.MOCK_DATE ?? defaultMockDate;
}

function acceptingApplications(campaign, date) {
  return campaign.opensOn <= date && date <= campaign.closesOn;
}

function findPublicationConflict(store, campaign, firstPublication) {
  const others = store.campaigns.filter(other => other.id !== campaign.id && other.status === 'Published');
  const overlap = others.find(other => other.opensOn <= campaign.closesOn && campaign.opensOn <= other.closesOn);
  if (overlap) {
    const message = `Choose a period that does not overlap ${overlap.id}.`;
    return error(409, 'ACTIVE_CAMPAIGN_EXISTS', 'The application period overlaps another published campaign.', {
      opensOn: message,
      closesOn: message,
    });
  }
  if (firstPublication && others.some(other => acceptingApplications(other, campaignDate()))) {
    return error(409, 'ACTIVE_CAMPAIGN_EXISTS', 'Another published campaign is currently accepting applications.');
  }
}

function findRemovedReferences(store, campaign) {
  const positionIds = new Set(campaign.departments.flatMap(department => department.positions.map(position => position.id)));
  const applicationIds = store.applications
    .filter(application => application.campaignId === campaign.id && !positionIds.has(application.positionId))
    .map(application => application.id)
    .sort();
  if (applicationIds.length) {
    const message = 'Keep positions that already have applications.';
    return error(409, 'REFERENCED_DATA_LOCKED', message, { departments: message }, applicationIds);
  }
}

function publicView(campaign) {
  const { id, name, hostClub, description, instructions, status, opensOn, closesOn, interviewDate } = campaign;
  return {
    id, name, hostClub, description, instructions, status, opensOn, closesOn, interviewDate,
    timeZone: campaign.timeZone,
    departments: campaign.departments.map(department => ({
      id: department.id,
      name: department.name,
      positions: department.positions.map(({ id, title, quota, description, requirements }) => ({
        id, title, quota, description, requirements,
      })),
    })),
    availabilitySlots: campaign.availabilitySlots.map(({ id, start, end }) => ({ id, start, end })),
  };
}

function executiveResponse(campaign, status = 200) {
  const { interviewWindow, durationMinutes, roomIds } = campaign;
  return {
    status,
    body: {
      campaign: {
        ...publicView(campaign),
        interviewWindow: interviewWindow ? { start: interviewWindow.start, end: interviewWindow.end } : null,
        durationMinutes,
        roomIds: [...roomIds],
      },
    },
  };
}

function validateQuery(query) {
  const keys = query instanceof URLSearchParams ? [...query.keys()] : Object.keys(query ?? {});
  if (keys.length) {
    return invalid(Object.fromEntries(keys.map(key => [`query.${key}`, 'This query parameter is not supported.'])));
  }
}

function validateBodylessRequest({ query, body }) {
  const refusal = validateQuery(query);
  if (refusal) return refusal;
  if (body !== undefined) return invalid({ body: 'Omit the request body.' });
}

function listPublic(context) {
  const refusal = validateBodylessRequest(context);
  if (refusal) return refusal;

  const published = context.store.campaigns.filter(campaign => campaign.status === 'Published')
    .sort((a, b) => compare(a.opensOn, b.opensOn) || compare(a.id, b.id));
  const today = campaignDate();
  const open = published.find(campaign => acceptingApplications(campaign, today));
  const upcoming = published.find(campaign => campaign.opensOn > today);
  const closed = published.filter(campaign => campaign.closesOn < today)
    .sort((a, b) => compare(b.closesOn, a.closesOn) || compare(a.id, b.id));
  const selected = open ?? upcoming ?? closed[0];

  return { status: 200, body: { campaigns: selected ? [publicView(selected)] : [] } };
}

function getPublic(context) {
  const refusal = validateBodylessRequest(context);
  if (refusal) return refusal;
  const { campaignId } = context.params;
  if (!isId(campaignId)) return invalid({ campaignId: 'Enter a campaign ID.' });
  const campaign = context.store.campaigns.find(item => item.id === campaignId && item.status === 'Published');
  return campaign ? { status: 200, body: { campaign: publicView(campaign) } } : notFound();
}

function executiveOnly(handle) {
  return context => {
    if (!context.user) return error(401, 'UNAUTHENTICATED', 'Sign in to continue.');
    if (context.user.role !== 'Executive') return error(403, 'FORBIDDEN', 'Executive access is required.');
    return handle(context);
  };
}

function withCampaign(handle, write = false) {
  return executiveOnly(context => {
    const { store, params: { campaignId } } = context;
    if (!isId(campaignId)) return invalid({ campaignId: 'Enter a campaign ID.' });
    const campaign = store.campaigns.find(item => item.id === campaignId);
    if (!campaign) return notFound();
    if (write && store.schedules.some(schedule => schedule.campaignId === campaignId && schedule.status === 'Confirmed')) {
      return error(409, 'CAMPAIGN_LOCKED', 'The confirmed campaign is read-only.');
    }
    return handle(context, campaign);
  });
}

function createCampaign({ store, query, body }) {
  const refusal = validateQuery(query) ?? validateWrite(body, true);
  if (refusal) return refusal;
  if (store.campaigns.some(campaign => campaign.id === body.id)) {
    return error(409, 'CAMPAIGN_ID_CONFLICT', 'The campaign ID already exists.');
  }

  const campaign = {
    name: '', hostClub: '', description: '', instructions: '', opensOn: null, closesOn: null, departments: [],
    ...structuredClone(body),
    status: 'Draft', timeZone, interviewDate: null, interviewWindow: null,
    durationMinutes: 20, roomIds: [], availabilitySlots: [],
  };
  store.campaigns.push(campaign);
  return executiveResponse(campaign, 201);
}

function saveCampaign({ store, query, body }, campaign) {
  const refusal = validateQuery(query) ?? validateWrite(body);
  if (refusal) return refusal;
  if (!Object.keys(body).length) return executiveResponse(campaign);
  const next = { ...campaign, ...body };
  if (campaign.status === 'Published') {
    const blocked = validatePublication(next) ?? findRemovedReferences(store, next) ?? findPublicationConflict(store, next, false);
    if (blocked) return blocked;
  }

  Object.assign(campaign, structuredClone(body));
  return executiveResponse(campaign);
}

function publishCampaign(context, campaign) {
  const refusal = validateBodylessRequest(context);
  if (refusal) return refusal;
  if (campaign.status === 'Published') return executiveResponse(campaign);
  const blocked = validatePublication(campaign) ?? findPublicationConflict(context.store, campaign, true);
  if (blocked) return blocked;

  campaign.status = 'Published';
  return executiveResponse(campaign);
}

export function registerRoutes(register) {
  const executiveCampaign = '/api/executive/campaigns/:campaignId';
  register('GET', '/api/campaigns', listPublic);
  register('GET', '/api/campaigns/:campaignId', getPublic);
  register('POST', '/api/executive/campaigns', executiveOnly(createCampaign));
  register('GET', executiveCampaign, withCampaign((context, campaign) => validateBodylessRequest(context) ?? executiveResponse(campaign)));
  register('PATCH', executiveCampaign, withCampaign(saveCampaign, true));
  register('POST', `${executiveCampaign}/publish`, withCampaign(publishCampaign, true));
}
