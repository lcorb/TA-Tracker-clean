function seed(db) {
    console.log('Seeding.');
    const sql = [
        `INSERT INTO "aideclass" VALUES ('taaaa1','ART081A'),
        ('taaaa2','ART081A'),
        ('taaaa1','ART081B'),
        ('taaaa3','ART081B'),
        ('taaaa1','DIG091A'),
        ('taaaa1','DIG091B'),
        ('taaaa1','DIG091C'),
        ('taaaa1','DIG101A')`,
       `INSERT INTO "aides" VALUES ('taaaa1','TA1','Test'),
        ('taaaa3','TA2','Test'),
        ('taaaa2','TA3','Test')`
    ];

    return db.runMultiple(sql);
}

module.exports = seed;