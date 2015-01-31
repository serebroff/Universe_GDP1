/* 
 * Useful funcs here
 * 
 */

//--------------------------------------------------------------------
//  Intersections
//--------------------------------------------------------------------

var intersect = {
    LineCircle: function(p1, p2, C, r)
    {
        var A = p1;
        var B = p2;
        var P;
        var AC = C.clone();
        AC.subtract(A);
        var AB = B.clone();
        AB.subtract(A);
        var ab2 = AB.dot(AB);
        var acab = AC.dot(AB);
        var t = acab / ab2;

        if (t < 0.0)
            t = 0.0;
        else if (t > 1.0)
            t = 1.0;

        //P = A + t * AB;
        P = AB.clone();
        P.multiply(t);
        P.add(A);

        var H = P.clone();
        H.subtract(C);
        var h2 = H.dot(H);
        var r2 = r * r;

        if (h2 > r2)
            return null;
        else
            return P;
    },
    // intersect right line with square (axis X,Y aligned)
    LineSquare: function(p, // Vec2 - upper left corner of square
            size,       // float - side of square
            k, b)	// float - equation of right line
    {
        var f;
        f = p.x * k + b;
        if (f >= p.y && f <= p.y + size)
            return true;
        f = (p.x + size) * k + b;
        if (f >= p.y && f <= p.y + size)
            return true;
        f = (p.y - b) / k;
        if (f >= p.x && f <= p.x + size)
            return true;
        f = (p.y + size - b) / k;
        if (f >= p.x && f <= p.x + size)
            return true;
        return false;
    },
    RayCircle: function(rO, rV, sO, sR)
    {
        var Q = sO.subtract(rO, 1);
        var c = Q.length();
        var v = Q.dot(rV); // rV should be normalized!!! 
        var d = sR * sR - (c * c - v * v);

        if (d < 0)
            return (-1.0);	 // если пересечения не было, возвращаем -1 //   <0 вместо -EPS ??????
        return (v - Math.sqrt(d)); // Возвращаем дистанцию до [первой] точки пересечения
    },
}

//--------------------------------------------------------------------
//  Seeded random generator
//--------------------------------------------------------------------


var rnd = {
    rand_array_:
            [
                16, 28, 172, 31, 52, 188, 90, 233, 27, 19, 232, 89, 56, 157, 170, 155, 130, 208, 45, 61, 228, 132, 115, 249, 215,
                51, 102, 123, 152, 26, 150, 143, 148, 179, 4, 223, 69, 224, 93, 5, 2, 63, 142, 169, 88, 85, 13, 190, 244, 24, 230,
                126, 222, 66, 47, 144, 37, 213, 73, 147, 241, 240, 86, 183, 10, 159, 239, 82, 17, 203, 250, 55, 211, 74, 151, 77,
                99, 236, 182, 231, 140, 112, 146, 225, 116, 212, 18, 43, 251, 122, 50, 100, 202, 60, 107, 137, 221, 192, 171, 156,
                44, 238, 174, 205, 168, 235, 124, 194, 23, 70, 42, 95, 176, 153, 84, 189, 245, 200, 30, 20, 254, 136, 247, 219, 14,
                29, 175, 41, 32, 255, 226, 65, 135, 22, 67, 72, 243, 252, 80, 0, 166, 181, 160, 33, 185, 161, 204, 46, 76, 81, 248,
                209, 128, 184, 229, 91, 237, 75, 83, 149, 186, 141, 199, 253, 9, 68, 117, 64, 106, 3, 39, 6, 198, 134, 242, 214, 218,
                227, 21, 49, 36, 217, 92, 97, 180, 138, 164, 48, 154, 119, 38, 109, 120, 127, 111, 165, 7, 87, 1, 94, 11, 196, 145,
                114, 58, 195, 96, 121, 110, 118, 12, 105, 113, 167, 101, 173, 210, 53, 187, 193, 34, 163, 8, 246, 57, 158, 220, 131,
                191, 62, 234, 139, 54, 162, 108, 178, 98, 197, 78, 133, 129, 177, 125, 201, 206, 40, 35, 104, 15, 71, 59, 79, 207,
                103, 25, 216
            ],
    lo_rand_: 0,
    hi_rand_: 0,    
    randposstack_: [],
    init:function()
    {
        this.randposstack_ = [];
        this.randomize(0);
    },
    pushrandpos: function()
    {
        randposstack_.push(lo_rand_);
        randposstack_.push(hi_rand_);
    },
    poprandpos: function()
    {
        hi_rand_ = randposstack_.pop();
        lo_rand_ = randposstack_.pop();
    },
    randomize: function(position)
    {
        this.hi_rand_ = this.rand_array_[position % 256];
        this.lo_rand_ = this.rand_array_[Math.floor(position / 256)];
    },
    getrandpos: function()
    {
        return this.hi_rand_ * 256 + this.lo_rand_;
    },
    random: function()
    {
        this.hi_rand_ = (this.hi_rand_ + 1) % 256;
        this.lo_rand_ = (this.lo_rand_ + 3) % 256;

        var rnd_ = 256 * this.rand_array_[this.hi_rand_] + this.rand_array_[this.lo_rand_];
        return rnd_ / 65536;       
    },
    irand: function(n)
    {
        this.hi_rand_ = (this.hi_rand_ + 1) % 256;
        this.lo_rand_ = (this.lo_rand_ + 3) % 256;
        return (256 * this.rand_array_[this.hi_rand_] + this.rand_array_[this.lo_rand_]) % n;
    },
    frand: function(n) // возвращает случайное число от  -n  до  n
    {
        this.hi_rand_ = (this.hi_rand_ + 1) % 256;
        this.lo_rand_ = (this.lo_rand_ + 3) % 256;

        var rnd_ = 256 * this.rand_array_[this.hi_rand_] + this.rand_array_[this.lo_rand_];
        return rnd_ / 32768 * n - n;
    },
    prand: function(n)  // возвращает случайное число от  0  до  n
    {
        this.hi_rand_ = (this.hi_rand_ + 1) % 256;
        this.lo_rand_ = (this.lo_rand_ + 3) % 256;

        var rnd_ = 256 * this.rand_array_[this.hi_rand_] + this.rand_array_[this.lo_rand_];
        return rnd_ * n / 65536;
    },
}

