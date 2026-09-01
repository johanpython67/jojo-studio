const canvas = document.getElementById("fieldCanvas");

if (canvas) {

    const ctx = canvas.getContext("2d");

    const chargeSlider = document.getElementById("charge");

    const chargeValue = document.getElementById("chargeValue");


    let charge = 1;

    let chargeX = 0;

    let chargeY = 0;

    let dragging = false;


    function resizeCanvas() {

        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width;

        canvas.height = rect.height;

        chargeX = canvas.width / 2;

        chargeY = canvas.height / 2;

        draw();

    }


    function draw() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
         * DRAW FIELD
         */

        const spacing = 45;

        for (
            let x = spacing / 2;
            x < canvas.width;
            x += spacing
        ) {

            for (
                let y = spacing / 2;
                y < canvas.height;
                y += spacing
            ) {

                const dx = chargeX - x;

                const dy = chargeY - y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);


                if (distance < 35) {
                    continue;
                }


                /*
                 * Direction of the field
                 */

                let directionX = dx / distance;

                let directionY = dy / distance;


                /*
                 * Positive charge:
                 * field points AWAY.
                 *
                 * Negative charge:
                 * field points TOWARD.
                 */

                if (charge > 0) {

                    directionX *= -1;

                    directionY *= -1;

                }


                /*
                 * Field strength
                 */

                const strength =
                    Math.min(
                        Math.abs(charge) * 12000 /
                        (distance * distance),
                        1
                    );


                const length =
                    8 + strength * 18;


                const startX =
                    x - directionX * length / 2;

                const startY =
                    y - directionY * length / 2;


                const endX =
                    x + directionX * length / 2;

                const endY =
                    y + directionY * length / 2;


                /*
                 * Arrow
                 */

                ctx.beginPath();

                ctx.moveTo(startX, startY);

                ctx.lineTo(endX, endY);

                ctx.strokeStyle =
                    `rgba(255,255,255,${0.15 + strength * 0.5})`;

                ctx.lineWidth = 1.5;

                ctx.stroke();


                const arrowSize = 4;


                ctx.beginPath();

                ctx.moveTo(endX, endY);

                ctx.lineTo(
                    endX - directionX * arrowSize
                    - directionY * arrowSize,

                    endY - directionY * arrowSize
                    + directionX * arrowSize
                );

                ctx.lineTo(
                    endX - directionX * arrowSize
                    + directionY * arrowSize,

                    endY - directionY * arrowSize
                    - directionX * arrowSize
                );

                ctx.closePath();

                ctx.fillStyle = "rgba(255,255,255,0.5)";

                ctx.fill();

            }

        }


        /*
         * DRAW CHARGE
         */

        ctx.beginPath();

        ctx.arc(
            chargeX,
            chargeY,
            25,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            charge >= 0 ? "#ffffff" : "#777777";

        ctx.fill();


        /*
         * Charge symbol
         */

        ctx.fillStyle =
            charge >= 0 ? "#000000" : "#ffffff";

        ctx.font = "bold 20px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(
            charge >= 0
                ? "+"
                : "−",

            chargeX,
            chargeY
        );

    }


    /*
     * SLIDER
     */

    chargeSlider.addEventListener(
        "input",
        function () {

            charge = Number(this.value);

            chargeValue.textContent = charge;

            draw();

        }
    );


    /*
     * DRAGGING
     */

    function moveCharge(x, y) {

        const rect =
            canvas.getBoundingClientRect();

        chargeX = x - rect.left;

        chargeY = y - rect.top;

        draw();

    }


    canvas.addEventListener(
        "mousedown",
        function (event) {

            const rect =
                canvas.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const distance =
                Math.sqrt(
                    (x - chargeX) ** 2 +
                    (y - chargeY) ** 2
                );


            if (distance < 40) {

                dragging = true;

            }

        }
    );


    canvas.addEventListener(
        "mousemove",
        function (event) {

            if (!dragging) return;

            moveCharge(
                event.clientX,
                event.clientY
            );

        }
    );


    canvas.addEventListener(
        "mouseup",
        function () {

            dragging = false;

        }
    );


    canvas.addEventListener(
        "mouseleave",
        function () {

            dragging = false;

        }
    );


    /*
     * TOUCH SUPPORT
     */

    canvas.addEventListener(
        "touchstart",
        function (event) {

            const touch = event.touches[0];

            const rect =
                canvas.getBoundingClientRect();

            const x =
                touch.clientX - rect.left;

            const y =
                touch.clientY - rect.top;

            const distance =
                Math.sqrt(
                    (x - chargeX) ** 2 +
                    (y - chargeY) ** 2
                );


            if (distance < 50) {

                dragging = true;

                event.preventDefault();

            }

        },
        { passive: false }
    );


    canvas.addEventListener(
        "touchmove",
        function (event) {

            if (!dragging) return;

            const touch = event.touches[0];

            moveCharge(
                touch.clientX,
                touch.clientY
            );

            event.preventDefault();

        },
        { passive: false }
    );


    canvas.addEventListener(
        "touchend",
        function () {

            dragging = false;

        }
    );


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    resizeCanvas();

            }
