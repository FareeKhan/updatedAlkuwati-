import ExportSvg from './ExportSvg';
//export const baseUrl = 'https://homee.ae/api'
//export const baseUrl = 'http://192.168.70.57:8000/api'
// export const baseUrl = 'https://kuwaity.skcosmetics.app/api'
export const baseUrl = 'https://backend.alkwaityalawl.com/api';
//export const baseUrl = 'https://demoapi.homee.ae/api'

export const OTP_URL = 'https://admin.homee.ae/';

// export const SP_KEY = 'pk_test_51Pjir909Qlf6znZyPJKWaATb6BQCubm7NTPIGBL0449uEjz82nv7d6fHGGOOwinDogCK3uJYWtJzdWhvFrQDjoEx00e5Iv94BY'
export const SP_KEY =
  'pk_test_51PV9zKFt9d3eerZLogRwve2G5YO4ZUNIUnLCEFpiljRIfKVN7hI7dle16OjcnN2ly7T2vwmB9FWJG0JGzSMCQnNe00k69iWIhI';
export const GOOGLE_API = 'AIzaSyAo2MfsEOJJqEyVA2iQ1xWVWcMQm_NnVV8';

export const discountProducts = [
  {
    discount: '50% off',
    title: 'on everything today',
    subTitle: 'With code rikafashion 2021',
    bgImage: require('../assets/discountImages/discount1.png'),
  },
  {
    discount: '70% off',
    title: 'on everything today',
    subTitle: 'With code rikafashion 2021',
    bgImage: require('../assets/discountImages/discount2.png'),
  },
  {
    discount: '75% off',
    title: 'on everything today',
    subTitle: 'With code rikafashion 2021',
    bgImage: require('../assets/discountImages/discount3.png'),
  },
  {
    discount: '60% off',
    title: 'on everything today',
    subTitle: 'With code rikafashion 2021',
    bgImage: require('../assets/discountImages/discount1.png'),
  },
];

export const governorateData = t => [
  {
    label: t('Al-Asima'),
    id: 1,
  },
  {
    label: t('Hawally'),
    id: 2,
  },
  {
    label: t('Mubarak-Al-Kabir'),
    id: 3,
  },
  {
    label: t('Ahmadi'),
    id: 4,
  },
  {
    label: t('Farwaniya'),
    id: 5,
  },
  {
    label: t('Jahra'),
    id: 6,
  },
];

export const CountriesData = t => [
  {
    label: t('Kuwait'),
    id: 1,
    code: '+965',
  },
  {
    label: t('Saudi Arabia'),
    id: 2,
    code: '+966',
  },
  {
    label: t('United Arab Emirates'),
    id: 3,
    code: '+971',
  },
  {
    label: t('Bahrain'),
    id: 4,
    code: '+973',
  },
  {
    label: t('Qatar'),
    id: 5,
    code: '+974',
  },
  {
    label: t('Oman'),
    id: 6,
    code: '+968',
  },
];

export const newArrival = [
  {
    title: 'The Marc Jacobs',
    subTxt: 'Traveler Tote',
    price: 'KD95.00',
    img: require('../assets/images/bag.png'),
  },
  {
    title: 'Axil Arigato',
    subTxt: 'Clean 90 Triple Sneakers',
    price: 'KD45.00',
    img: require('../assets/images/shoes.png'),
  },
  {
    title: 'The Marc Jacobs',
    subTxt: 'Traveler Tote',
    price: 'KD95.00',
    img: require('../assets/images/bag.png'),
  },
  {
    title: 'Axil Arigato',
    subTxt: 'Clean 90 Triple Sneakers',
    price: 'KD45.00',
    img: require('../assets/images/shoes.png'),
  },
];

export const sizeData = [
  {
    id: 1,
    label: 'XS',
  },
  {
    id: 2,
    label: 'S',
  },
  {
    id: 3,
    label: 'M',
  },
  {
    id: 4,
    label: 'L',
  },
  {
    id: 5,
    label: 'XL',
  },
];

export const colorData = [
  {
    id: 1,
    label: 'red',
  },
  {
    id: 2,
    label: 'blue',
  },
  {
    id: 3,
    label: 'green',
  },
  {
    id: 4,
    label: 'orange',
  },
  {
    id: 5,
    label: 'black',
  },
];

export const allProducts = [
  {
    title: 'New Arrivals',
    products: '208 products',
    img: require('../assets/productImages/shirt1.png'),
  },
  {
    title: 'Clothes',
    products: '358 products',
    img: require('../assets/productImages/shirt2.png'),
  },
  {
    title: 'Bags',
    products: '160 Products',
    img: require('../assets/productImages/shirt3.png'),
  },
  {
    title: 'Shoes',
    products: '230 Products',
    img: require('../assets/productImages/shirt4.png'),
  },
  {
    title: 'Electronics',
    products: '230 Products',
    img: require('../assets/productImages/shirt5.png'),
  },
];

export const bags = [
  {
    title: 'The Marc Jacobs',
    subTxt: 'Traveler Tote',
    price: 'KD95.00',
    img: require('../assets/bagImages/bag1.png'),
  },
  {
    title: 'Bembien',
    subTxt: 'Clean 90 Triple Sneakers',
    price: 'KD45.00',
    img: require('../assets/bagImages/bag2.png'),
  },
  {
    title: 'Herschel Supply Co.',
    subTxt: 'Traveler Tote',
    price: 'KD95.00',
    img: require('../assets/bagImages/bag3.png'),
  },
  {
    title: 'Dagne Dover',
    subTxt: 'Clean 90 Triple Sneakers',
    price: 'KD45.00',
    img: require('../assets/bagImages/bag4.png'),
  },
];

export const electronics = [
  {
    title: 'On Ear Headphone',
    subTxt: 'Traveler Tote',
    price: 'KD95.00',
    img: require('../assets/electronicImages/electronic1.png'),
  },
  {
    title: 'Apple Watch',
    subTxt: 'Clean 90 Triple Sneakers',
    price: 'KD45.00',
    img: require('../assets/electronicImages/electronic2.png'),
  },
  {
    title: 'Table lamp LED',
    subTxt: 'Traveler Tote',
    price: 'KD95.00',
    img: require('../assets/electronicImages/electronic3.png'),
  },
  {
    title: 'light bulb',
    subTxt: 'Clean 90 Triple Sneakers',
    price: 'KD45.00',
    img: require('../assets/electronicImages/electronic4.png'),
  },
];

export const discount = [
  {
    title: 'On Ear Headphone',
    subTxt: 'Traveler Tote',
    price: 'KD95.00',
    img: require('../assets/electronicImages/electronic1.png'),
  },
  {
    title: 'Apple Watch',
    subTxt: 'Clean 90 Triple Sneakers',
    price: 'KD45.00',
    img: require('../assets/electronicImages/electronic2.png'),
  },
  {
    title: 'Table lamp LED',
    subTxt: 'Traveler Tote',
    price: 'KD95.00',
    img: require('../assets/electronicImages/electronic3.png'),
  },
  {
    title: 'light bulb',
    subTxt: 'Clean 90 Triple Sneakers',
    price: 'KD45.00',
    img: require('../assets/electronicImages/electronic4.png'),
  },
];

export const filters = [
  {
    title: 'Dresses',
  },
  {
    title: 'Jackets',
  },

  {
    title: 'Shoes',
  },
  {
    title: 'Bags',
  },
  {
    title: 'Clothes',
  },
  {
    title: 'Jeans',
  },
  {
    title: 'Shorts',
  },
  {
    title: 'Tops',
  },
  {
    title: 'Sneakers',
  },
  {
    title: 'Cots',
  },
  {
    title: 'Lingenies',
  },
];

export const sorted = [
  {
    name: 'New Today',
  },
  {
    name: 'New This Week',
  },
  {
    name: 'Top Sellers',
  },
];

export const ratingStar = [
  {
    star: <ExportSvg.FiveStar />,
    rating: 'five',
  },
  {
    star: <ExportSvg.FourStar />,
    rating: 'four',
  },
  {
    star: <ExportSvg.ThreeStar />,
    rating: 'three',
  },
  {
    star: <ExportSvg.TwoStar />,
    rating: 'two',
  },
];

export const productSize = [
  {
    size: 'S',
  },
  {
    size: 'M',
  },
  {
    size: 'L',
  },
];

export const PaymentCards = [
  {
    paymentMethod: 'Credit Card',
  },
  {
    paymentMethod: 'Paypal',
  },
  {
    paymentMethod: 'Visa',
  },
  {
    paymentMethod: 'Google Pay',
  },
];

export const dressList = [
  {
    title: 'Roller Rabbit',
    subTxt: 'Vado Odelle Dress',
    price: 'KD98.00',
    img: require('../assets/images/girlImages/GirlFirst.png'),
  },
  {
    title: 'endless rose',
    subTxt: 'Bubble Elastic T-shirt',
    price: 'KD50.00',
    img: require('../assets/images/girlImages/GirlSecond.png'),
    right: true,
  },
  {
    title: 'Roller Rabbit',
    subTxt: 'Vado Odelle Dress',
    price: 'KD98.00',
    img: require('../assets/images/girlImages/GirlThird.png'),
  },
  {
    title: 'Bella Chaooo',
    subTxt: 'Vado Odelle Dress',
    price: 'KD98.00',
    img: require('../assets/images/girlImages/GirlFourth.png'),
    right: true,
  },
  {
    title: 'Roller Rabbit',
    subTxt: 'Vado Odelle Dress',
    price: 'KD98.00',
    img: require('../assets/images/girlImages/GirlThird.png'),
  },
  {
    title: 'Bella Chaooo',
    subTxt: 'Vado Odelle Dress',
    price: 'KD98.00',
    img: require('../assets/images/girlImages/GirlFourth.png'),
    right: true,
  },
];

export const paymentMethodCard = t => [
  {
    paymentName: t('creditCard'),
    svg: <ExportSvg.CreditCard />,
    id: 1,
  },
  {
    paymentName: t('cash'),
    svg: <ExportSvg.Wallet />,
    id: 2,
  },
];

export const arabicToEnglish = text => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return text.replace(/[٠-٩]/g, d => englishNumbers[arabicNumbers.indexOf(d)]);
};

export const terms_ar = `ALKUWAITY AL AWAL TRADING تدير موقع ("الموقع"). فيما يلي شروط الاستخدام التي تحكم استخدام الموقع ("شروط الاستخدام"). من خلال استخدام الموقع، فإنك توافق صراحةً على الالتزام بهذه الشروط وسياسة الخصوصية الخاصة بـ ALKUWAITYALAWAL.ME، واتباع جميع القوانين واللوائح المعمول بها المتعلقة باستخدام الموقع. تحتفظ ALKUWAITY AL AWAL TRADING بالحق في تعديل هذه الشروط في أي وقت، وتصبح التعديلات سارية فور نشرها على الموقع. يرجى مراجعة هذه الصفحة بشكل دوري. سيتم الإشارة إلى أي تحديثات للشروط في أسفل الصفحة. في حالة انتهاكك لهذه الشروط، يحق لـ ALKUWAITY AL AWAL TRADING إنهاء استخدامك للموقع، ومنعك من استخدامه مستقبلاً، واتخاذ الإجراءات القانونية المناسبة ضدك.

الترخيص المحدود
يتم منحك ترخيصًا محدودًا وغير حصري وقابلًا للإلغاء وغير قابل للتحويل لاستخدام الموقع وفقًا للمتطلبات والقيود المذكورة في هذه الشروط. يحق لـ ALKUWAITY AL AWAL TRADING تغيير أو تعليق أو إيقاف أي جزء من الموقع في أي وقت، دون إشعار أو مسؤولية. كما يجوز لها فرض قيود على ميزات وخدمات معينة أو تقييد وصولك إلى الموقع كليًا أو جزئيًا. ليس لديك أي حقوق في البرامج أو الوثائق الخاصة بالموقع.

تشغيل الموقع
الإمارات العربية المتحدة هي بلد الإقامة الخاص بـ ALKUWAITY AL AWAL TRADING، ويتم تشغيل الموقع منها. لا تقدم الشركة أي ضمانات بأن الموقع مناسب للاستخدام في مواقع أخرى، وإذا كنت تستخدمه من خارج الإمارات، فإنك مسؤول عن الامتثال للقوانين المحلية.

القانون المعمول به
يخضع استخدام الموقع لهذه الشروط وفقًا لقوانين دولة الإمارات العربية المتحدة، دون الإخلال بمبادئ تنازع القوانين. يتم الفصل في أي نزاعات أمام المحاكم المختصة في دولة الإمارات.

المعاملات متعددة العملات
العملة المختارة من قبلك عند الشراء ستكون نفس العملة المدفوعة وستظهر في إيصال المعاملة.

المشتريات
تقبل ALKUWAITY AL AWAL TRADING الدفع ببطاقات فيزا وماستركارد بالدرهم الإماراتي للمنتجات والخدمات. تخضع جميع المشتريات عبر الإنترنت لشروط مقدمي الخدمات التجارية، لذا يُنصح بمراجعة سياساتهم قبل إجراء أي معاملة.

الدول الخاضعة لعقوبات OFAC
لن تتعامل ALKUWAITY AL AWAL TRADING مع الأفراد أو الشركات الخاضعة لعقوبات مكتب مراقبة الأصول الأجنبية (OFAC)، بما في ذلك الأشخاص أو الكيانات المصنفة ضمن قوائم الإرهاب أو تجارة المخدرات.

إقرارات المستخدم
عند استخدام الموقع، فإنك تقر وتتعهد بأنك تبلغ 18 عامًا على الأقل، وأن أي محتوى تقدمه لا ينتهك حقوق الآخرين. لا يجوز للقاصرين (أقل من 18 سنة) التسجيل أو إجراء معاملات على الموقع.

الاستخدام المسموح به
يُسمح لك بزيارة الموقع واستخدامه للأغراض الشخصية فقط. لا يجوز لك إعادة إنتاج أو نشر أو توزيع أي محتوى دون إذن مسبق من ALKUWAITY AL AWAL TRADING. يجب على حامل البطاقة الاحتفاظ بسجلات المعاملات وسياسات التاجر.

حساب المستخدم
إذا كنت تستخدم الموقع، فأنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور، وتتحمل المسؤولية عن جميع الأنشطة التي تتم من خلال حسابك. لن يكون الموقع مسؤولًا عن أي خسائر ناتجة عن سوء استخدام الحساب.

الاستخدام التجاري غير المصرح به
لا يجوز لك استخدام الموقع لأي أغراض تجارية دون إذن خطي من ALKUWAITY AL AWAL TRADING. ستتخذ الشركة الإجراءات القانونية ضد أي انتهاك، بما في ذلك منع المخالفين من استخدام الموقع.

الروابط والبحث
قد يحتوي الموقع على روابط لمواقع خارجية، ولا تتحمل ALKUWAITY AL AWAL TRADING مسؤولية المحتوى أو دقته أو قانونيته. استخدامك لهذه الروابط يكون على مسؤوليتك الخاصة.

سياسة حقوق النشر
يجوز لـ ALKUWAITY AL AWAL TRADING إنهاء حساب أي مستخدم ينتهك حقوق النشر. باستخدامك للموقع، فإنك تضمن أن أي محتوى تقدمه لا ينتهك حقوق الملكية الفكرية للآخرين.

الملكية الفكرية
جميع المواد المتاحة على الموقع هي ملكية فكرية لـ ALKUWAITY AL AWAL TRADING ولا يجوز نسخها أو إعادة توزيعها دون إذن مسبق. أنت تقر بأن جميع التعديلات أو التحسينات التي تجريها على المواد تظل مملوكة للشركة.

إخلاء المسؤولية
يتم توفير الموقع ومحتوياته "كما هي" دون أي ضمانات صريحة أو ضمنية. ALKUWAITY AL AWAL TRADING لا تضمن دقة أو موثوقية المعلومات المقدمة من المستخدمين. لن تتحمل الشركة أي مسؤولية عن الأضرار الناتجة عن استخدام الموقع.

انتهاك شروط الاستخدام
إذا انتهكت الشروط، يحق لـ ALKUWAITY AL AWAL TRADING إنهاء وصولك للموقع، وإزالة أي معلومات غير مصرح بها، واتخاذ الإجراءات القانونية المناسبة.

التعويض
توافق على تعويض ALKUWAITY AL AWAL TRADING وحمايتها من أي مطالبات أو خسائر ناتجة عن انتهاكك لهذه الشروط، بما في ذلك استخدامك للموقع لنشر روابط أو تحميل محتوى غير مصرح به.

الترخيص الممنوح لك
عند إرسال محتوى إلى ALKUWAITY AL AWAL TRADING، فإنك تمنحها حقًا غير قابل للإلغاء لاستخدام هذا المحتوى بأي وسيلة متاحة. سيتم التعامل مع أي معلومات ترسلها كمعلومات غير سرية وغير مملوكة.

الإعلانات
قد يحتوي الموقع على إعلانات من أطراف ثالثة، وتكون هذه الأطراف مسؤولة عن الامتثال للقوانين المتعلقة بالإعلانات.`;

export const refund_policy_ar = `شكرًا لتسوقك الكويتي الاول. نحن نقدر رضاك ونريد أن نضمن أن تكون لديك تجربة إيجابية مع منتجاتنا. إذا لم تكن راضيًا تمامًا عن مشترياتك، نحن هنا للمساعدة.

الإرجاع

الأهلية:
لكي تكون مؤهلاً للإرجاع، يجب أن يكون المنتج غير مستخدم وفي نفس الحالة التي استلمتها بها.
يجب أن يكون المنتج أيضًا في عبوته الأصلية.

نافذة الإرجاع:
لديك 14 يومًا تقويميًا من تاريخ التسليم لبدء عملية الإرجاع.

العملية:
تواصل مع فريق دعم العملاء لدينا عبر البريد الإلكتروني [info@alkwaityalawl.com] أو من خلال الواتساب [+965-97292020] لطلب الإرجاع.
قم بتضمين رقم الطلب، إثبات الشراء، وتفسير موجز لسبب الإرجاع.
بمجرد الموافقة على طلب الإرجاع الخاص بك، ستتلقى تصريح إرجاع البضائع وتعليمات حول كيفية إرسال المنتج.

الشحن:
تتحمل مسؤولية تغطية تكاليف الشحن للإرجاع ما لم يكن المنتج معيبًا أو تالفًا عند الوصول.
نوصي باستخدام خدمة شحن يمكن تتبعها أو شراء تأمين الشحن. لا يمكننا ضمان استلامنا للمنتج المرتجع.

العناصر غير القابلة للإرجاع:
- بطاقات الهدايا
- المنتجات التي لم يتم شراؤها مباشرة من الموقع
- العناصر التي تم وضع علامة "بيع نهائي" عليها

الاستردادات

الفحص والموافقة:
بمجرد استلامنا للمنتج المرتجع، سيتم فحصه.
إذا تم الموافقة على الإرجاع، سنبدأ عملية استرداد الأموال إلى طريقة الدفع الأصلية الخاصة بك في غضون 7-10 أيام عمل.

الاستردادات الجزئية:
المنتجات التي ليست في حالتها الأصلية، أو التي تكون تالفة أو مفقودة أجزاء منها لأسباب ليست خطأنا، قد تحصل على استردادات جزئية.

الاستردادات المتأخرة أو المفقودة:
إذا لم تستلم استرداد الأموال بعد، يرجى التحقق من حسابك البنكي مرة أخرى.
ثم تواصل مع شركة بطاقة الائتمان الخاصة بك؛ قد يستغرق الأمر بعض الوقت قبل أن يتم نشر استرداد الأموال رسميًا.
إذا قمت بكل ذلك ولم تستلم استرداد الأموال بعد، يرجى الاتصال بنا على [info@alkwaityalawl.com] أو من خلال الواتساب [+965-97292020]

الاستبدالات:
نحن نستبدل العناصر فقط إذا كانت معيبة أو تالفة. إذا كنت بحاجة إلى استبدال المنتج بنفس العنصر، يرجى الاتصال بنا على [info@alkwaityalawl.com] أو من خلال الواتساب [+965-97292020]

اتصل بنا:
إذا كان لديك أي أسئلة حول سياسة الإرجاع والاسترداد الخاصة بنا، يرجى الاتصال بنا على:

البريد الإلكتروني: [info@alkwaityalawl.com]
الهاتف: [+965-97292020]`;


export const about_us_ar = `شركة سوق الكويتي الأول : شركة كويتية تستورد العديد من المنتجات الإبداعية والمميزة التي تبحثون عنها من جميع أنحاء العالم إلى الكويت، وأن تكون منتجاتنا في متناول الجميع لتجعل التسوق أسهل وأسرع لاحتياجاتكم اليومية والترفيهية وأكثر من ذلك بكثير. تأسست شركة سوق الكويتي الأول في عام 2015. وتتكون حالياً من فرعين داخل دولة الكويت.

* سوق الكويتي الأول هي حلقة وصل مع كافة أطياف العملاء التي تفتخر بخدمتهم، حيث تتمثل الأفرع في محافظة الفروانية، منطقة الشويخ الصناعية.
* يقدم سوق الكويتي الأول مجموعة واسعة من الملابس النسائية وملابس الأطفال والمنتجات الإلكترونية والذكية الحديثة والعطور ومستحضرات التجميل والمنتجات الترفيهية ومنتجات متنوعة، وجميع الإكسسوارات والعناية الشخصية والأجهزة الكهربائية والإلكترونية والأصناف ذات الصلة. كما يمكن لعملائنا زيارة الأفرع والاستمتاع بتجربة تسوق تتميز بحرية الاختيار وتنوع المنتجات عالية الجودة.
* ستجد أيضاً فريق العمل جاهزاً دائماً للإجابة على استفساراتكم. نحن في شركة سوق الكويتي الأول حريصون على قيمة التنوع والجودة العالية. عند زيارتك لمعرضنا ستجد خيارات متنوعة ومناسبة لك تنتمي لمجموعة واسعة من الماركات العالمية ذات الجودة العالية، لنجعل تجربة التسوق الخاصة بك أكثر متعة وسهولة.
* نحن ندرك المنتجات والأصناف والموديلات التي يبحث عنها عملائنا والتي تستحق ثقتهم، لذلك جعلنا توفير منتجات معتمدة تدوم لفترة طويلة مع عملائنا وتقديم خدمة عالية الجودة هدفنا الرئيسي، حتى نبقى دائمًا محل ثقة عملائنا.

* رؤيتنا:
نهدف إلى أن نصبح الوجهة الأولى في التسوق من المعارض أو من خلال الإنترنت في دولة الكويت وفي مجلس دول التعاون الخليجي، وأن نوسع أعمالنا استراتيجياً، سواء في منطقة الشرق الأوسط أو العالم، إن شاء الله، حيث نؤمن بأن بناء علاقات ثقة متبادلة قوية وطويلة الأمد مع عملائنا هو ما يجعل "سوق الكويتي الأول" وعلامتها التجارية رمزاً، ويدل على هوية جودة منتجاتنا وخدماتنا.

* مهمتنا:
رضا العملاء هو مهمتنا. نهدف إلى بناء الثقة فيما يتعلق بجودة منتجاتنا وموثوقية معلوماتنا.

* خدمات:

* خدمة العملاء والدعم الفني:
نقدم الدعم عبر قنوات التواصل الاجتماعي أو عن طريق التواصل مع خدمة العملاء عبر رسائل الواتساب على الرقم 00965/61664536 - 00965/97292020

* خدمة التوصيل:
نقدم خدمة التوصيل للمنازل خلال 24 ساعة من إتمام عملية الشراء داخل الكويت، والتوصيل خلال 3 إلى 5 أيام عمل لدول مجلس التعاون الخليجي.

* استقبال الشكاوى والاقتراحات:
نستمع لعملائنا بعناية، حيث نوفر خدمة عملاء مخصصة لتلقي شكاوى ومقترحات عملائنا.

* متابعة مع العملاء:
نحتفظ بقاعدة بيانات شاملة لعملائنا تحتوي على معلومات حول المنتجات التي اشتروها وسجل معاملاتهم ومعلومات الضمان. كل هذا حتى نتمكن من جعل خدمة العملاء السريعة والمتكاملة أكثر ملاءمة لهم. تظل كل هذه المعلومات معنا كمعلومات خاصة ولا تتم مشاركتها مع أي طرف ثالث.`;
