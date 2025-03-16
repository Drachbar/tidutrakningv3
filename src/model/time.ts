export type time = {
  weeks: week[];
}

export type week = {
  weekNo: string;
  monday: day;
  tuesday: day;
  wednesday: day;
  thursday: day;
  friday: day;
  saturday: day;
  sunday: day;
};

export type day = {
  start?: Date;
  lunchOut?: Date;
  lunchIn?: Date;
  end?: Date;
};
