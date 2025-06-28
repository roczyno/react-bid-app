import "./forgotPassword.scss";

const ForgotPassword = () => {
  return (
    <div className="fp">
      <div className="container">
        <div className="wrapper">
          <h4>Recover Password</h4>
          <hr />
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO8AAACUCAMAAABMS46JAAAAZlBMVEX///8ztigptB1nxGEvtSOl2qERsAAutyAArADv+e/7/fu037HN6ssArgAlsxb4/Pjk8+Os3anW7tXd8dyN0olCujltxmee15uV1JJOvUfE58I6tzB+zHlUvk12yXHH58Zfw1i847q7Jch9AAADrElEQVR4nO2da7OqIBSGj4ScvLA0La2tmf7/P3m6TnTZxT6JwJ73+djEzHpcuARx4M8fAAAA4ECcfy3Wbdsu66SIbAdjlixK173cI4hICCnnq3bIf6t0vluvpGCBCiNJ3VDaDs0AUVLRnewJTmJTF7bDG5lsqIj4E9tTlsV2ndsOcUzKKvje9mjMNontIMcjYa9tTzmubIc5EnE7f2t7gOhX1K18JnRsj536K7Yd7ceUM9LU3Qs3SWY73g/Je33do7DtgD8jeppdzvbjq6cljDVftkP+iPbh3uUkZbCtuqpfCSkenBn3+UFcy4fE8u7rMmCOy3pF7E6ZMasRf0Q5v0/ednFXkNKuuevYorUT7Odkq9vxMj3YHki7uxSTr7dwfVurRPt8PBEtgpvrwno/Z4jl5kZD1t9qFIF6ZTgPpwxzNNY36ZWLF2OnolH/S72PNbrYKunlMnw5VCwatS8IH0cdofroFcs3A8VdoBQtmvmX4LyiHwnUam+g3RQhjkrKrwnjzfD2/5E60BZr3+YNsdqdqdMIP1EuENv69kiKlO7MtSYBsVrfhG9T/zxQs6XVJFQ79MJwfGOTKjMF0hs/RDd3gOH4xmah+ArNp0t/7dCs8ezNzvKaLB5otqmVNsKzAq2UK5pptlHvAenXiCNW5gq01GwUKdNl6VeBjptreRa6051Y9fVrRSlWHkdSe/Sv9ufUZHijA18d4OsL8NUBvr4AXx3g6wvw1QG+rpNl0QnFVywuP75D9R1OjTJ35/1ZGfY0P6MucYq5HjeL4/Ly46pNnXw5WyyFeP9Z2c/hQm4H57IcJ8HjxxhjQXLp2OuduKZn376Ohqjcer8TmujJKlS5lOFdY1jXrSW0vNL9RPITYXfWSIcJdAPRufJYirqffCP5/8KulKycG797j76urBmm8n2wI+DMmmEyjS/b2BY9E05RrvYDy7+2Rc/AF77whS984esC8IUvfOELX/i6AHzhC1/4whe+LgBf+MIXvvCFrwvAF77whS984esC8IUvfOELX/i6AHzhC1/4whe+LgBf+MIXvvCFrwvAF77whS984esC8P3dvouJfHX3kTbNMNF+Bb1t0TPlNPkVuvtImybaGN0b6YJ05VykbD1FgnnjzA5Jt6fbGEK8PmFnSrLa/AY6tHUmvYczM00L6xw5MyHFxqwwZ6E7230dKDcmaxYTz062s0rUzk2lmEteOlOrrhQzQcRGh8Tq1VFvNomGZTUbmS50ZVszAACYlH9x5lHmWUSXRgAAAABJRU5ErkJggg=="
            alt=""
          />
          <input type="email" placeholder="Enter your email" />
          <button>Recover</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
